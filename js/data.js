/* =====================================================================
   CONTENT DATA — add projects, gallery items and testimonials here
   Fields left null render as clearly marked placeholders in the drawer.
   ===================================================================== */
const PROJECTS = [
  { id:'vanyatra', name:'VanYatra', client:'VanYatra', category:'Website design',
    summary:'A booking site for camper-van and tempo-traveller journeys across India.',
    overview:'Marketing website for VanYatra, built around one promise on the home screen: “Your Home. On Every Road.” Visitors can book an adventure or explore the fleet straight from the first view.',
    objectives:null, approach:null, outcomes:null,
    services:['Website design','Visual design'],
    images:['assets/work/vanyatra.jpg'], plate:'#1f3326', plateInk:'#e8e3cf',
    behance:'https://www.behance.net/gallery/252806577/VanYatra' },
  { id:'mgss', name:'MGSS Identity', client:'Mahatma Gandhi Seva Sangh', category:'Brand identity',
    summary:'Tree mark, wordmarks and typographic lockups for an organisation founded in 1994.',
    overview:'Identity work for Mahatma Gandhi Seva Sangh (MGSS), “Mobilising Grassroots Support Systems”. The set includes a hand-drawn tree mark, a primary lockup, a colour-block wordmark and a stacked typographic version.',
    objectives:null, approach:null, outcomes:null,
    services:['Branding','Logo design','Visual identity'],
    images:['assets/id/id1.jpg','assets/id/id5.jpg','assets/id/id8.jpg','assets/id/id7.jpg'], plate:'#e9dff0', plateInk:'#4a2a63' },
  { id:'firstcry', name:'Cashback Campaign', client:'FirstCry', category:'Mailer & banner',
    summary:'A 100% cashback mailer and an extra 50% cashback campaign banner.',
    overview:'Campaign creatives for FirstCry: a long-form promotional mailer that reads top to bottom, and a matching display banner for the extra 50% cashback offer.',
    objectives:null, approach:null, outcomes:null,
    services:['Marketing creatives','Banner design','Campaign design'],
    images:['assets/firstcry-mailer.jpg','assets/firstcry-banner.jpg'], plate:'#fbe6d8', plateInk:'#7a3412', pan:true,
    behance:'https://www.behance.net/gallery/75491179/100-Cashback-Mailer-Design' },
  { id:'apects', name:'Open Cloud', client:'APECTS', category:'Product interface',
    summary:'An IT service-management dashboard for tickets, SLA metrics and incidents.',
    overview:'Interface design for APECTS Open Cloud. The dashboard brings tickets, SLA breaches, first-response metrics and incident management into one service-management overview.',
    objectives:null, approach:null, outcomes:null,
    services:['App design','Digital interfaces','Visual design'],
    images:['assets/work/apects.jpg'], plate:'#1d1d22', plateInk:'#e6e6dc' },
  { id:'posters', name:'Session Posters', client:null, category:'Event posters',
    summary:'Posters for product community sessions: a Dunzo teardown and the Netflix story.',
    overview:'A poster series for product community sessions. One poster introduces a product teardown of Dunzo; the other tells the Netflix story, “From Blockbuster to Streaming Giant”, built as a collage of stills.',
    objectives:null, approach:null, outcomes:null,
    services:['Graphic design','Visual design'],
    images:['assets/netflix-poster.jpg','assets/dunzo-poster.jpg'], plate:'#161616', plateInk:'#e6e6dc' },
  { id:'meesho', name:'Meesho App', client:'Meesho', category:'App design',
    summary:'Product listing, catalogue and social-profile screens for a shopping app.',
    overview:'App screens for Meesho covering a product page, a catalogue listing with sharing actions, and a seller social profile.',
    objectives:null, approach:null, outcomes:null,
    services:['App design','Visual design'],
    images:['assets/work/meesho.jpg'], plate:'#f6dbe6', plateInk:'#6b1f45' },
  { id:'globalit', name:'Global IT Services', client:'Global IT Services', category:'Website design',
    summary:'A launch page for an IT accessories service with a 150-item catalogue.',
    overview:'Launch page for a new IT accessories service. The headline “Order the gear you need. Instantly.” leads into a certified 150-item catalogue for desk delivery.',
    objectives:null, approach:null, outcomes:null,
    services:['Website design','Visual design'],
    images:['assets/work/globalit.jpg'], plate:'#0f1a30', plateInk:'#d9e4ff' },
  { id:'techworld', name:'Tech World Championships', client:'Tech World Championships', category:'Web platform',
    summary:'An event platform for streamed quizzes, debates and live scorecards.',
    overview:'Platform screens for Tech World Championships: a streamed Generative AI quiz, buzz events, playalong winners, scorecards and a news section.',
    objectives:null, approach:null, outcomes:null,
    services:['Website design','Digital interfaces'],
    images:['assets/work/techworld.jpg'], plate:'#121417', plateInk:'#e6e6dc' }
];

const CAPABILITIES = [
  { id:'brand', name:'Brand & Identity', short:'Brand', angle:-135, need:'Branding',
    lead:'Positioning, identity and guidelines that hold up in every application, from the first sketch of a mark to the full system.',
    services:[
      ['Branding','Positioning, identity and guidelines that hold up in every application.'],
      ['Logo design','Marks built from the business, tested at every size.'],
      ['Brand identity systems','Colour, type and usage rules a team can apply without us in the room.'],
      ['Visual identity','A consistent look across every touchpoint, from first page to final file.']],
    previews:[{img:'assets/id/id1.jpg',project:'mgss'},{img:'assets/id/id3.jpg'},{img:'assets/id/id4.jpg'},{img:'assets/id/id9.jpg'}] },
  { id:'digital', name:'Digital Experiences', short:'Digital', angle:-45, need:'Website design',
    lead:'Websites and product interfaces that look considered and give each visitor a clear next step.',
    services:[
      ['Website design','Marketing and portfolio sites that turn a visit into an enquiry.'],
      ['App design','Visual interface design for product teams, without a full UX engagement.'],
      ['Digital interfaces','Dashboards and platform screens that keep dense information readable.']],
    previews:[{img:'assets/work/vanyatra.jpg',project:'vanyatra'},{img:'assets/work/apects.jpg',project:'apects'},{img:'assets/work/meesho.jpg',project:'meesho'},{img:'assets/work/globalit.jpg',project:'globalit'}] },
  { id:'comms', name:'Communication & Marketing', short:'Marketing', angle:45, need:'Social media creatives',
    lead:'Campaign visuals built to get a message noticed, in sets a small team can keep running.',
    services:[
      ['Social media creatives','Posts, carousels and campaign sets a small team can keep running.'],
      ['Advertising creatives','Ads built to get a message noticed.'],
      ['Marketing creatives','Mailers, offers and promotional visuals.'],
      ['Campaign design','One idea carried across every format of a campaign.'],
      ['Banner design','Display and web banners sized for every placement.']],
    previews:[{img:'assets/firstcry-banner.jpg',project:'firstcry'},{img:'assets/firstcry-mailer.jpg',project:'firstcry'},{img:'assets/netflix-poster.jpg',project:'posters'},{img:'assets/dunzo-poster.jpg',project:'posters'}] },
  { id:'info', name:'Information & Visual Communication', short:'Information', angle:135, need:'Infographics',
    lead:'Complex data and processes turned into one clear visual, and documents that argue their point.',
    services:[
      ['Infographics','Complex data and processes turned into one clear visual.',true],
      ['Company decks','Pitch, sales and board decks, structured to argue one point per slide.'],
      ['Presentations','Explainers and training material that stay clear at a glance.'],
      ['Brochures','Print and digital brochures with a clear reading order.'],
      ['Graphic design','Brochures, banners, print and digital collateral, finished to a professional standard.'],
      ['Print-ready files','Artwork prepared to the printer’s specification.'],
      ['Video editing','Short edits and motion explainers.']],
    previews:[{video:'assets/infographic.mp4',poster:'assets/posters/infographic.jpg'},{video:'assets/palette.mp4',poster:'assets/posters/palette.jpg'},{img:'assets/id/id2.jpg'},{img:'assets/showreel-poster.jpg'}] }
];

/* PLACEHOLDERS — replace with approved client testimonials (quote, name, role, company, optional photo/logo). */
const TESTIMONIALS = [
  { quote:'Client testimonial goes here, in the client’s own words. Two or three sentences reads best at this size.', name:'Client name', role:'Designation', company:'Company', photo:null, placeholder:true, tint:'var(--bg)' },
  { quote:'A second client testimonial goes here. Mention the project and what changed for the business after launch.', name:'Client name', role:'Designation', company:'Company', photo:null, placeholder:true, tint:'var(--paper-2)' },
  { quote:'A third testimonial goes here. Keep each quote approved by the client before it is published on the site.', name:'Client name', role:'Designation', company:'Company', photo:null, placeholder:true, tint:'var(--bg)' }
];

const NEEDS = ['Branding','Logo design','Website design','Company deck','Social media creatives','Infographics','Other'];
const TICKER = ['Branding','Logo design','Website design','Company decks','App design','Social media creatives','Infographics','Advertising creatives','Visual design','Graphic design'];
