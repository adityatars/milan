// HIVI.gaming — Scenario Data
const PERSONAS = {
  1: [
    {name:"Sarah Chen",title:"VP of Operations",type:"Gatekeeper",emoji:"👩‍💼",
     style:"polite but guarded",hook:"She controls calendar access to the C-suite."},
    {name:"Marcus Webb",title:"Director of IT",type:"Influencer",emoji:"👨‍💻",
     style:"technical and skeptical",hook:"He's been burned by vendors before."}
  ],
  2: [
    {name:"Diana Reeves",title:"Chief Revenue Officer",type:"Decision Maker",emoji:"👩‍💼",
     style:"empathetic but analytical",hook:"She cares deeply about her team's pain points."},
    {name:"Tom Alvarez",title:"Head of Sales Enablement",type:"Champion",emoji:"👨‍💼",
     style:"enthusiastic but politically cautious",hook:"He wants to look good internally."}
  ],
  3: [
    {name:"Richard Park",title:"CFO",type:"Economic Buyer",emoji:"🧑‍💼",
     style:"numbers-driven, skeptical of ROI claims",hook:"He killed the last 3 vendor proposals."},
    {name:"Aisha Patel",title:"VP Finance",type:"Influencer",emoji:"👩‍💼",
     style:"detail-oriented, risk-averse",hook:"She needs ironclad business cases."}
  ],
  4: [
    {name:"James O'Brien",title:"General Counsel",type:"Legal Blocker",emoji:"⚖️",
     style:"formal, compliance-focused",hook:"He's rewriting the vendor policy."},
    {name:"Priya Sharma",title:"CISO",type:"Security Gate",emoji:"🔐",
     style:"cautious, zero-trust mindset",hook:"She's blocked 12 deals this quarter."}
  ],
  5: [
    {name:"Elena Vasquez",title:"VP Customer Success",type:"Relationship Owner",emoji:"🤝",
     style:"collaborative but metric-driven",hook:"Adoption is her top KPI."},
    {name:"David Kim",title:"Account Executive",type:"Expansion Lead",emoji:"📈",
     style:"hungry for upsell, politically aware",hook:"He sees a 3x expansion opportunity."}
  ]
};

const PHASE_INFO = {
  1:{name:"General",subtitle:"Prospecting & Qualification",desc:"Build rapport, identify decision makers vs influencers, and set the initial hook."},
  2:{name:"Psychology",subtitle:"Discovery & Empathy",desc:"Active listening, emotional triggers, and uncovering negative consequences of the status quo."},
  3:{name:"Negotiator ROI",subtitle:"The Business Case",desc:"Build financial justification, present value proposition, handle price objections with data."},
  4:{name:"Enterprise",subtitle:"Organizational Navigation",desc:"Manage the buying committee. Navigate Legal, Procurement, and IT security."},
  5:{name:"Account Management",subtitle:"Expansion",desc:"Post-sale relationship building, adoption, and upsell/cross-sell opportunities."}
};

const SCENARIOS = {
  1: {
    opening: (v,s) => `You are 4 minutes into a cold call with <strong>${PERSONAS[1][0].name}</strong>, VP of Ops at a ${s} ${v} company. She cuts you off: <em>"Look, I get 50 calls like this a week. We already use a legacy system. Send me an email with what you do and I'll look at it."</em>`,
    choices: [
      {id:"1a",text:"'I will definitely send that over. Just to make sure it's relevant, what are the top 3 challenges you have with your legacy system?'",trust:-10,econ:0,momentum:-15,
       coach:"TRAP: You complied with the blow-off. She is not going to read the email, and asking for 'top 3 challenges' on a cold call is unearned and annoying.",tag:"❌ Fatal Compliance"},
      {id:"1b",text:"'Sarah, usually when someone tells me to send an email, it's a polite way of telling me to go away. Is that the case here?'",trust:20,econ:5,momentum:15,
       coach:"Pattern interrupt (Radical Candor). By calling out the brush-off professionally, you force a real human interaction. You just earned her respect.",tag:"🎯 Elite Move"},
      {id:"1c",text:"'I can send an email, but honestly, we've helped companies like yours cut costs by 30%. I just need 5 minutes to explain how.'",trust:-15,econ:-5,momentum:-10,
       coach:"TRAP: You sound desperate and pitchy. Everyone claims 30% savings. You haven't diagnosed a problem yet, so your pitch is noise.",tag:"❌ Desperation"},
      {id:"1d",text:"'Happy to. Most Ops VPs in ${v} tell me they're struggling with data silos right now. Is that why you asked for the email?'",trust:10,econ:5,momentum:5,
       coach:"Not bad. You used an industry hypothesis to test for pain. It's a bit presumptive but better than just rolling over.",tag:"⚠️ Solid"}
    ],
    follow: (prev,v,s) => {
      if(prev==="1b"||prev==="1d") return {
        text:`Sarah sighs, her tone softening slightly. <em>"Fair enough. We aren't actively looking, but our integration costs with the legacy system are bleeding our Q3 budget. I have 10 minutes next Tuesday. Can you show me a demo then?"</em>`,
        choices:[
          {id:"1e",text:"'Absolutely. I'll send the calendar invite right now. I'll prepare a customized demo for Tuesday.'",trust:-5,econ:-10,momentum:-15,
           coach:"TRAP: You agreed to a demo before doing Discovery! You will show up on Tuesday and feature-dump because you have no idea what 'integration costs' actually means to her.",tag:"❌ Amateur Mistake"},
          {id:"1f",text:"'I'll put the 10 minutes on the calendar. But to be transparent, 10 minutes isn't enough for a demo. Could we use that time to see if your integration issue is actually something we can fix?'",trust:25,econ:10,momentum:20,
           coach:"Masterful upfront contract. You protected your time, set boundaries, and framed the meeting around HER problem, not YOUR product.",tag:"🎯 Elite Move"},
          {id:"1g",text:"'I appreciate that. Before Tuesday, can you connect me with Marcus in IT so I can understand the technical side?'",trust:-10,econ:5,momentum:-5,
           coach:"Too early. You haven't established enough value with Sarah to ask for internal referrals. She will see this as you bypassing her.",tag:"⚠️ Premature Ask"}
        ]
      };
      return {
        text:`Sarah hangs up. You manage to reach Marcus in IT the next day. He says: <em>"We are locked into a 3-year contract with our current vendor. We literally cannot switch right now. Sorry."</em>`,
        choices:[
          {id:"1h",text:"'When does the contract expire? I'd love to reach out 6 months before renewal.'",trust:0,econ:0,momentum:-20,
           coach:"You just accepted a 'no' and pushed the deal out 3 years. The pipeline is dead.",tag:"❌ Deal Dead"},
          {id:"1i",text:"'Understood. But Marcus, if you're locked in, why did you take my call?'",trust:15,econ:10,momentum:10,
           coach:"Direct and psychological. If he took the call, there's pain. You need to uncover the friction the current contract is causing.",tag:"✅ Strong Move"},
          {id:"1j",text:"'We have a buyout program where we cover the cost of breaking legacy contracts.'",trust:-15,econ:-20,momentum:-10,
           coach:"TRAP: Throwing money at an unqualified prospect destroys your margin and makes you look cheap. You haven't proven any value yet.",tag:"❌ Value Destruction"}
        ]
      };
    }
  },
  2: {
    opening: (v,s) => `Phase 2: Discovery. You are in a 45-minute meeting with <strong>${PERSONAS[2][0].name}</strong> (CRO) and her champion, Tom. Diana leans forward: <em>"Your platform looks nice, but my reps are overwhelmed. The last thing I need is to force another tool on them. Why should I disrupt my sales floor for this?"</em>`,
    choices: [
      {id:"2a",text:"'Because our tool is actually designed to reduce their workflow by automating data entry. It's incredibly intuitive.'",trust:-10,econ:-5,momentum:-15,
       coach:"TRAP: You are defending your product (feature pitching) instead of exploring her fear of disruption. You're arguing with the buyer.",tag:"❌ Defensive Pitch"},
      {id:"2b",text:"'It sounds like adoption was a nightmare with your last rollout. What exactly happened?'",trust:20,econ:10,momentum:15,
       coach:"Tactical Empathy. You labeled the underlying emotion (fear of a past failure repeating) and invited her to share the real pain. Excellent.",tag:"🎯 Elite Move"},
      {id:"2c",text:"'Diana, if you don't disrupt the floor now, how will you hit the aggressive Q4 targets Tom mentioned?'",trust:10,econ:15,momentum:5,
       coach:"Challenging the status quo is good, but throwing Tom under the bus by using his intel against his boss is politically risky.",tag:"⚠️ High Risk"},
      {id:"2d",text:"'We offer comprehensive onboarding and a dedicated Customer Success Manager to ensure zero friction.'",trust:-5,econ:-10,momentum:-5,
       coach:"TRAP: You are throwing services at an unquantified problem. Everyone promises 'great onboarding'. It's an empty promise to a CRO.",tag:"❌ Empty Promise"}
    ],
    follow: (prev,v,s) => {
      if(prev==="2b"||prev==="2c") return {
        text:`Diana exhales. <em>"The last CRM rollout took 8 months. Reps hated it. We lost $${s==='SMB'?'500K':'2.5M'} in pipeline visibility during the transition. I can't risk that again. But... we are flying blind right now."</em>`,
        choices:[
          {id:"2e",text:"'So the real cost isn't the software, it's the $${s==='SMB'?'500K':'2.5M'} in lost pipeline. What happens to the business if you fly blind for another 6 months?'",trust:25,econ:25,momentum:20,
           coach:"Masterclass. You quantified the Cost of Inaction (COI) using her own numbers, and drove the pain deeper by asking about the future.",tag:"🎯 Elite Closer"},
          {id:"2f",text:"'I guarantee our rollout takes less than 30 days. We have it in writing.'",trust:-10,econ:0,momentum:-10,
           coach:"TRAP: 'I guarantee' is sales breath. You skipped past her vulnerability to pitch your speed. You missed the opportunity to quantify the pain.",tag:"❌ Missed Pain"},
          {id:"2g",text:"'Tom, you see the floor every day. Is the lack of visibility hurting rep quota attainment?'",trust:15,econ:10,momentum:15,
           coach:"Good multi-threading. You pulled the Champion into the conversation to validate the pain in front of the Decision Maker.",tag:"✅ Solid Move"}
        ]
      };
      return {
        text:`Diana looks unimpressed. <em>"Look, we don't have the budget right now anyway. Check back with us in Q1."</em>`,
        choices:[
          {id:"2h",text:"'If we could defer payments until Q1, would you be open to starting the implementation now?'",trust:-15,econ:-25,momentum:-10,
           coach:"TRAP: You just offered a massive financial concession to an unqualified buyer. 'No budget' is usually a smokescreen for 'No value'.",tag:"❌ Value Destruction"},
          {id:"2i",text:"'Diana, usually when someone tells me there's no budget, it means I haven't shown you enough value to justify finding the money. Is that the case?'",trust:20,econ:15,momentum:15,
           coach:"Radical candor. You called out the smokescreen professionally. This forces her to either admit there's no pain, or tell you the real objection.",tag:"🎯 Elite Move"},
          {id:"2j",text:"'Understood. I'll put a note to reach out in January. Thanks for your time.'",trust:0,econ:0,momentum:-25,
           coach:"You took the brush-off at face value. Deal lost.",tag:"❌ Deal Dead"}
        ]
      };
    }
  },
  3: {
    opening: (v,s) => `Phase 3: The Business Case. You are on a Zoom with <strong>${PERSONAS[3][0].name}</strong> (CFO) and Aisha (VP Finance). Richard shares his screen showing a spreadsheet. <em>"Your proposal is $120,000/year. My team calculated the ROI based on your claims, and it takes 18 months to break even. In this economy, I only approve tools with a 6-month payback. Cut the price by 40% or we are done."</em>`,
    choices: [
      {id:"3a",text:"'Let me talk to my VP. I might be able to get you 25% if you sign by Friday.'",trust:-25,econ:-30,momentum:-20,
       coach:"TRAP: The ultimate rookie mistake. You folded instantly, proving your original price was inflated. You destroyed your credibility and your margin.",tag:"❌ Fatal Error"},
      {id:"3b",text:"'Richard, I can't do 40%. But if we agree to a 3-year term paid upfront, I can do 15%.'",trust:-10,econ:-10,momentum:5,
       coach:"Trading concessions is better than folding, but you are still negotiating price before defending value. He will take your 15% and ask for more.",tag:"⚠️ Weak Negotiation"},
      {id:"3c",text:"'Richard, I appreciate the analysis. Can you walk me through the assumptions Aisha used to build this model? I think we might be missing the Cost of Inaction.'",trust:20,econ:25,momentum:15,
       coach:"Elite response. You didn't flinch at the threat. By questioning the *model's assumptions*, you shift the debate from price to value.",tag:"🎯 Elite Move"},
      {id:"3d",text:"'We don't discount our software because the value is proven. Our top clients see a 3x return in 4 months.'",trust:-15,econ:10,momentum:-10,
       coach:"Being rigid and arrogant with a CFO will get you thrown out of the room. You have to collaborate on the math, not dictate it.",tag:"❌ Arrogant"}
    ],
    follow: (prev,v,s) => {
      if(prev==="3c") return {
        text:`Richard looks at Aisha. She says: <em>"We only factored in time saved by the reps. We didn't include the pipeline visibility you discussed with Diana, because it's too hard to quantify."</em>`,
        choices:[
          {id:"3e",text:"'If Diana's team prevents just ONE lost ${s==='SMB'?'$50K':'$250K'} deal per quarter due to visibility, the software pays for itself in 3 months. Shall we model that?'",trust:25,econ:30,momentum:20,
           coach:"Flawless execution. You tied the economic value directly back to the emotional pain you uncovered in Phase 2. The CFO cannot argue with revenue.",tag:"🎯 Elite Closer"},
          {id:"3f",text:"'You have to include pipeline visibility. That's the whole point of the platform.'",trust:-5,econ:5,momentum:-5,
           coach:"Telling a VP Finance what she 'has to do' without providing the math is a losing strategy.",tag:"❌ Poor Tone"},
          {id:"3g",text:"'Let me send you a generic ROI calculator our marketing team built. It includes pipeline metrics.'",trust:-15,econ:-10,momentum:-15,
           coach:"TRAP: A CFO will destroy a generic marketing ROI calculator. You must build the business case using THEIR numbers, live.",tag:"❌ Lazy Follow-up"}
        ]
      };
      return {
        text:`Richard smirks. <em>"I don't care about your terms or your other clients. My budget is $72,000. Can you meet it or not?"</em>`,
        choices:[
          {id:"3h",text:"'If we drop to $72,000, we have to remove the dedicated CSM and the predictive analytics module. Does Diana agree to that?'",trust:15,econ:15,momentum:10,
           coach:"Good 'Give-Get' negotiation. If you drop price, you MUST reduce scope. Pitting the CFO's budget against the CRO's desired features is smart.",tag:"✅ Strong Move"},
          {id:"3i",text:"'I'll do $72,000, but I need a case study and a referral after 6 months.'",trust:-10,econ:-25,momentum:5,
           coach:"TRAP: Trading a $48K discount for a hypothetical case study is terrible business. You just proved your software is wildly overpriced.",tag:"❌ Margin Killer"},
          {id:"3j",text:"'Richard, if $72k is a hard line, we might not be the right partner for you.'",trust:20,econ:0,momentum:5,
           coach:"The ultimate walk-away. If you call his bluff, he may respect you and find the money. If he isn't bluffing, you avoided a bad deal.",tag:"🎯 Bold Walkaway"}
        ]
      };
    }
  },
  4: {
    opening: (v,s) => `Phase 4: The Gauntlet. You are in procurement. <strong>${PERSONAS[4][0].name}</strong> (General Counsel) emails you: <em>"We cannot accept your Limitation of Liability. We require unlimited liability for data breaches. Also, Priya (CISO) is rejecting your architecture because data is hosted in the US, not locally."</em>`,
    choices: [
      {id:"4a",text:"Email back: 'I will ask our legal team to accept the unlimited liability to get this deal done.'",trust:-20,econ:-40,momentum:-10,
       coach:"TRAP: You just committed corporate suicide. Accepting unlimited liability for data breaches could bankrupt your company. Never promise legal terms.",tag:"❌ Fireable Offense"},
      {id:"4b",text:"'James, unlimited liability is a non-starter for us. Can we schedule a 15-minute call with our GC to find a commercial cap that satisfies Priya's risk profile?'",trust:20,econ:10,momentum:20,
       coach:"Professional and firm. You protected your company while immediately proposing a pathway to resolution between the legal peers.",tag:"🎯 Elite Move"},
      {id:"4c",text:"Call Diana (CRO) and complain that Legal is blocking the deal she wanted.",trust:-15,econ:0,momentum:-10,
       coach:"TRAP: Whining to your champion makes you look weak. Diana wants you to solve problems, not create political headaches for her.",tag:"❌ Political Blunder"},
      {id:"4d",text:"'We can do local hosting, but it will cost an extra $30,000 in implementation fees.'",trust:5,econ:15,momentum:0,
       coach:"Commercializing a compliance requirement is an okay strategy, but you did it over email without negotiating the liability clause first.",tag:"⚠️ Risky"}
    ],
    follow: (prev,v,s) => {
      if(prev==="4b"||prev==="4d") return {
        text:`On the call, James says: <em>"Fine, we'll cap liability at 3x contract value. But Priya is digging her heels in on the data residency. We have to host locally."</em>`,
        choices:[
          {id:"4e",text:"'Priya, if we utilize end-to-end encryption with keys that only YOU hold, does the physical server location still violate your specific compliance framework?'",trust:25,econ:10,momentum:20,
           coach:"Brilliant. You challenged the security blocker with a technical workaround that gives the CISO control. This is how enterprise deals are saved.",tag:"🎯 Elite Closer"},
          {id:"4f",text:"'We don't offer local hosting. You'll just have to accept US servers.'",trust:-15,econ:0,momentum:-20,
           coach:"Ultimatums to a CISO always fail. She will kill the deal out of spite and compliance duty.",tag:"❌ Deal Dead"},
          {id:"4g",text:"'If we commit to building local hosting on our roadmap for Q3 next year, will you sign today?'",trust:5,econ:0,momentum:10,
           coach:"Selling roadmap promises to Security is incredibly risky, but it sometimes works as a bridging strategy.",tag:"⚠️ Desperate Bridge"}
        ]
      };
      return {
        text:`Legal is furious at your approach. James emails Diana (CRO) saying your company is 'too risky to do business with.' Diana calls you: <em>"What is going on? Legal is about to kill this."</em>`,
        choices:[
          {id:"4h",text:"'Diana, James is demanding terms that no SaaS vendor can legally provide. We need your help to override him.'",trust:-10,econ:0,momentum:-15,
           coach:"Forcing the CRO into a war with Legal is a terrible position. She loses political capital.",tag:"❌ Political Blunder"},
          {id:"4i",text:"'Diana, I apologize. I mishandled the communication with James. I'm setting up a peer-to-peer call between our GCs right now to resolve this without involving you further.'",trust:20,econ:5,momentum:15,
           coach:"Extreme Ownership. You took the heat, apologized to the buyer, and proposed a solution that removes the burden from her. Respect earned.",tag:"🎯 Elite Move"},
          {id:"4j",text:"'I'll just sign their document. Send it over.'",trust:-25,econ:-40,momentum:0,
           coach:"Panic. You caved to internal buyer politics and accepted catastrophic legal risk.",tag:"❌ Fatal Error"}
        ]
      };
    }
  },
  5: {
    opening: (v,s) => `Phase 5: Expansion. You closed the deal 8 months ago. You have a QBR today. You log into the Zoom, but Diana (your champion) isn't there. Instead, <strong>${PERSONAS[5][0].name}</strong> (VP Customer Success) joins and says: <em>"Diana left the company last week. I'm inheriting this tool. Honestly, my team hates it. We are considering terminating at the 12-month mark."</em>`,
    choices: [
      {id:"5a",text:"'I'm so sorry to hear that. I can offer your team 3 free training workshops to get them up to speed.'",trust:-10,econ:-5,momentum:-15,
       coach:"TRAP: You reacted to an executive change by offering tactical training. Elena doesn't care about training; she cares about KPIs. The relationship is resetting.",tag:"❌ Tactical Trap"},
      {id:"5b",text:"'Wow, big news. Elena, before Diana left, she bought this to solve a $${s==='SMB'?'500K':'2.5M'} pipeline visibility issue. Is that still a priority for you?'",trust:25,econ:20,momentum:15,
       coach:"Perfect pivot. You immediately anchored the new executive to the original business case and Cost of Inaction. You are re-qualifying the account.",tag:"🎯 Elite Move"},
      {id:"5c",text:"'If you terminate, you'll be subject to the early cancellation penalties in the contract.'",trust:-25,econ:0,momentum:-20,
       coach:"Threatening a new executive with legal penalties during your first meeting guarantees they will churn. You are now the enemy.",tag:"❌ Hostile Action"},
      {id:"5d",text:"'Let me fly out there next week to meet your team and figure out why they hate it.'",trust:15,econ:0,momentum:10,
       coach:"Showing up in person demonstrates commitment, but it's expensive and doesn't immediately address the strategic misalignment.",tag:"⚠️ Good Effort"}
    ],
    follow: (prev,v,s) => {
      if(prev==="5b"||prev==="5d") return {
        text:`Elena pauses. <em>"Yes, pipeline is still the priority. The problem is your tool doesn't integrate well with our new marketing stack. We spend hours manually porting data."</em>`,
        choices:[
          {id:"5e",text:"'We actually have a premium integration module for that. It's an extra $20k/year, but it solves this completely.'",trust:-15,econ:-10,momentum:-10,
           coach:"TRAP: Pitching an upsell when the customer is a massive churn risk is tone-deaf. Secure the base before you expand.",tag:"❌ Tone Deaf Upsell"},
          {id:"5f",text:"'That's unacceptable. Let me get our implementation engineers on a call tomorrow to build a custom API bridge for you, at our cost.'",trust:20,econ:-10,momentum:20,
           coach:"You took a margin hit, but you saved a massive account by taking immediate ownership of the friction. This is true Customer Success.",tag:"🎯 Elite Retention"},
          {id:"5g",text:"'Let's map out the current data flow together right now. I want to see exactly where the manual work is happening.'",trust:15,econ:5,momentum:15,
           coach:"Consultative troubleshooting. You are rolling up your sleeves to understand the workflow before pitching a fix.",tag:"✅ Strong Move"}
        ]
      };
      return {
        text:`Elena is frustrated. <em>"Look, I'm auditing all of Diana's software purchases. Provide me with a usage report by Friday. I have to go."</em>`,
        choices:[
          {id:"5h",text:"Send the automated usage report from your admin panel.",trust:-10,econ:-15,momentum:-15,
           coach:"TRAP: 'Usage' does not equal 'Value'. If they hate the tool, usage is low. Sending a report of low usage gives her the ammunition to fire you.",tag:"❌ Lazy Death"},
          {id:"5i",text:"'I'll send the usage data, but I'll also include an Executive Summary mapping those usage metrics to the $${s==='SMB'?'50K':'250K'} in pipeline we saved last quarter.'",trust:20,econ:20,momentum:15,
           coach:"You refused to let raw data tell the story. By tying the metrics to ROI, you force Elena to realize that churning means losing money.",tag:"🎯 Elite Move"},
          {id:"5j",text:"'Elena, I need a champion internally. Who is the biggest power user on your team right now?'",trust:10,econ:0,momentum:10,
           coach:"Multi-threading in an emergency. You need someone on the inside to defend the tool while you work on Elena.",tag:"⚠️ Survival Mode"}
        ]
      };
    }
  }
};

window.PERSONAS = PERSONAS;
window.PHASE_INFO = PHASE_INFO;
window.SCENARIOS = SCENARIOS;
