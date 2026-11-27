import"../chunks/CWj6FrbW.js";import"../chunks/PnhHYrrA.js";import{p as r,a as c,c as d,u as l,d as n,r as u}from"../chunks/DOGs90up.js";import{f as m,a as p}from"../chunks/Dy0G56yJ.js";import{h}from"../chunks/qlm7WSlf.js";import{i as y}from"../chunks/D4DlkRTT.js";import{k as o}from"../chunks/CumxtpOb.js";const t=`# Privacy Policy for StackInterval.com

Last Updated: August 09, 2025

## Introduction

Welcome to StackInterval.com ("we," "us," or "our"), a platform where users can freely meet and participate in live coding sessions. We are committed to protecting your privacy and providing transparency about how we handle your information. This Privacy Policy explains our practices regarding the collection, use, storage, and protection of data on our site. By using StackInterval.com, you agree to the terms outlined in this policy.

Please note that StackInterval.com is designed to minimize the collection of personal information. We do not require real names or email addresses to create an account. However, we may request an email address in the future for communication purposes, such as notifications or account recovery.

## Information We Collect

### Account Information

- When you create an account, we collect minimal data, such as a username (which does not need to be your real name). No email or other personal identifiers are required at this time.
- In the future, we may collect email addresses voluntarily provided by users for communication purposes.

### Session Data

- During live coding sessions, CodeMirror's state and presence information are transmitted to our server via Web Sockets.
- During live coding sessions, if connected to WebRTC, your audio is transmitted to other session participants.
- During live coding sessions, we use CodeMirror to save state and presence information to your browser's IndexedDB.
- Audio from your microphone is captured and temporarily stored in IndexedDB during the session.
- When a session ends, the state, presence, and audio data are uploaded to our storage servers. This data is then loaded each time the session is accessed or replayed in the browser.
- Sessions, once recorded, are stored indefinitely and cannot currently be deleted by users (they can be deleted by request).

### Other Data

- We may collect technical information automatically, such as your IP address, browser type, device information, and usage patterns (e.g., pages visited, time spent on sessions) to improve site functionality and troubleshoot issues.
- We use cookies for session management, by storing a JWT token.

We do not intentionally collect sensitive personal information, such as financial data, health information, or government-issued IDs. However, since sessions include audio, users may inadvertently share personally identifiable information (PII) through speech. We strongly advise against sharing any PII during sessions, as audio is recorded and stored.

## How We Use Your Information

- **To Provide Services**: Session data (including audio) is used to enable real-time collaboration, store sessions for replay, and facilitate coding practice.
- **Improvement and Analytics**: Technical data helps us analyze site performance, fix bugs, and enhance user experience. In the future, we may transcribe session audio and process it via large language models (LLMs) to generate summaries, insights, or other features to improve the platform.
- **Communication**: If you provide an email in the future, it may be used to send updates, notifications, or respond to inquiries.
- **Legal Compliance**: We may use data to comply with legal obligations, enforce our terms, or protect our rights.

We do not sell, rent, or share your data for marketing purposes.

## Sharing of Information

We do not share your personal information with third parties, except in the following limited circumstances:

- With service providers (e.g., cloud storage providers like AWS S3) who assist in operating the site, under strict confidentiality agreements.
- If required by law, such as in response to a subpoena or court order.
- In the event of a merger, acquisition, or sale of assets, where your data may be transferred to the new entity.

Recorded sessions are publicly accessible if shared via links, so any information (including audio) in them could be viewed by others. We recommend reviewing sessions before sharing to avoid unintentional disclosure of PII.

## Data Storage and Security

- Data is stored on secure servers with industry-standard encryption and access controls. Specifically, we use AWS S3 to store state, presence, and audio files.
- IndexedDB data is local to your browser and is only uploaded to our servers at the end of a session.
- Despite our efforts, no system is completely secure. We cannot guarantee absolute security against unauthorized access.

## User Rights and Controls

- **Access and Correction**: You can access your session data by visiting the relevant session pages. For corrections or other requests, contact us as described below.
- **Deletion**: Currently, there is no self-service option to delete accounts or recorded sessions. We plan to add an edit feature allowing participants to crop sessions and exclude unwanted content (e.g., chatter containing PII). If you accidentally upload PII, please contact an administrator immediately for assistance.
- **Opt-Out**: Since minimal data is collected, opt-out options are limited. You can stop using the site at any time.

For users in regions with data protection laws (e.g., GDPR, CCPA), you may have additional rights, such as data portability or erasure requests. Contact us to exercise these rights.

## Children's Privacy

StackInterval.com is not intended for children under 13 years of age. We do not knowingly collect data from children under 13. If we become aware of such data, we will delete it promptly.

## Changes to This Policy

We may update this Privacy Policy from time to time. Changes will be posted here with an updated "Last Updated" date. Continued use of the site after changes constitutes acceptance of the revised policy.

## Contact Us

If you have questions, concerns, or requests regarding this policy or your data (e.g., to report accidental PII upload), please contact our administrator.

Thank you for using StackInterval.com!
`;var f=m('<section class="markdown-body marked svelte-1065bec"><!></section>');function P(s,a){r(a,!1),y();var e=f(),i=d(e);h(i,()=>(n(o),n(t),l(()=>o(t)))),u(e),p(s,e),c()}export{P as component};
