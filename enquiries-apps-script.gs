// AntVisual enquiries -> the spreadsheet to which this script is bound.
// See SETUP-Google-Apps-Script.md before deploying the web app.
var SHEET_NAME = 'Enquiries';
var RECEIPT_TTL_SECONDS = 600;
var HEADERS = ['Received', 'Name', 'Email', 'Need', 'Message', 'Status', 'Submission ID'];

function clean(value, maxLength) {
  var text = String(value == null ? '' : value).trim().slice(0, maxLength || 2000);
  return /^[=+\-@]/.test(text) ? "'" + text : text; // prevent spreadsheet formula injection
}

function jsonOut(value) {
  return ContentService.createTextOutput(JSON.stringify(value))
    .setMimeType(ContentService.MimeType.JSON);
}

function validSubmissionId(value) {
  return /^[A-Za-z0-9_-]{16,80}$/.test(String(value || ''));
}

function doPost(e) {
  var data = {};
  var id = '';
  var cache = CacheService.getScriptCache();

  try {
    data = JSON.parse(e && e.postData && e.postData.contents || '{}');
    id = String(data.id || '');
    if (!validSubmissionId(id)) throw new Error('Invalid submission ID');

    var cacheKey = 'receipt:' + id;
    var existingStatus = cache.get(cacheKey);
    if (existingStatus === 'saved' || existingStatus === 'processing') {
      return jsonOut({ ok: true, status: existingStatus });
    }
    cache.put(cacheKey, 'processing', RECEIPT_TTL_SECONDS);

    // Treat bots caught by the hidden field as accepted without recording them.
    if (String(data.website || '').trim()) {
      cache.put(cacheKey, 'saved', RECEIPT_TTL_SECONDS);
      return jsonOut({ ok: true, status: 'saved' });
    }

    var name = clean(data.name, 120);
    var email = String(data.email || '').trim().slice(0, 254);
    var need = clean(data.need, 120);
    var message = clean(data.message, 2000);
    if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !need || !message) {
      throw new Error('Required fields are missing or invalid');
    }

    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    if (!spreadsheet) throw new Error('This script must be bound to the enquiries spreadsheet');
    var lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      var sheet = spreadsheet.getSheetByName(SHEET_NAME) || spreadsheet.insertSheet(SHEET_NAME);
      if (sheet.getLastRow() === 0) sheet.appendRow(HEADERS);
      sheet.appendRow([new Date(), name, email, need, message, 'new', id]);
    } finally {
      lock.releaseLock();
    }

    cache.put(cacheKey, 'saved', RECEIPT_TTL_SECONDS);
    return jsonOut({ ok: true, status: 'saved' });
  } catch (error) {
    if (validSubmissionId(id)) {
      try {
        cache.put('receipt:' + id, 'failed', RECEIPT_TTL_SECONDS);
      } catch (cacheError) {
        // The browser's receipt check will time out and report that delivery is unconfirmed.
      }
    }
    Logger.log('Enquiry submission failed: ' + (error && error.message ? error.message : error));
    return jsonOut({ ok: false, status: 'failed' });
  }
}

// The site cannot read a cross-origin Apps Script POST response. This JSONP
// endpoint exposes only a short-lived status for a random submission ID.
function doGet(e) {
  var params = e && e.parameter ? e.parameter : {};
  var id = String(params.id || '');
  var callback = String(params.callback || '');
  if (params.action !== 'status' ||
      !validSubmissionId(id) ||
      !/^antVisualReceipt_[A-Za-z0-9_]+$/.test(callback)) {
    return jsonOut({ ok: false, status: 'invalid_request' });
  }

  var status = CacheService.getScriptCache().get('receipt:' + id) || 'pending';
  var result = { ok: status === 'saved', status: status };
  return ContentService.createTextOutput(callback + '(' + JSON.stringify(result) + ');')
    .setMimeType(ContentService.MimeType.JAVASCRIPT);
}
