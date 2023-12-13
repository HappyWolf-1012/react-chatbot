
- DONE! Do DB update
- DONE! Add a alert at  the start if user doesnt have an API key
- DONE! update crawlers
- DONE! Create include js to implement in website
- DONE! Add clear chat on chatbotjs
- DONE! When update chatbot also update openAI
- DONE! Add minimify in chatbotjs build.sh
- DONE! When update chatbot also update openAI
- DONE! Finish the Update chatbot form
- DONE! Add maximum file size while uploading and crawling
- DONE! create subscriptions
- DONE! Validate on all api call that the user has an api key

TODO:
- DONE! track messages and count the number of messages
- DONE! If the user has more than 20 messages this month, ask him to upgrade to a paid plan
- DONE! Display to home page the number of messages this month and if limit is reached
- Display markdown correctly in chat

- After X message ask the user to contact you directly by email
- Get the url from the citation and display it as a link in the chat

- Create documentation with gitbooks and implement our own chatbot with it

- Add a "how to" on the dashboard when there is nothing only add the button create chatbot on main page when there is at least one file



- SECURITY: CREATE LIMIT RATE
- SECURITY: VALIDATE THAT THE CHATBOT REQUEST COMES FROM THE GOOD WEBSITE

- Use threads to keep converstaion context


CLIENT CHATBOTJS:
- After few seconds create a popup message "Hello, I'm a chatbot, how can I help you?"
- Add timeout after few minutes trying to get a reply a return "We could not awsner your question..."
- Add parameter for "After x question the person can contact us"
- Keep track of la conversations

Landing page:

- Open source alternative to all chatbots
- Bring your own api, don't get charged more than what open AI do
- Low code required
- Powered by custom gpts
- Unlimited message
- Implement on unlimited websites


How to implement chatbot on your website:

```html
<!doctype html>
<html>

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

</head>
<script>
  window.chatbotConfig = {
    chatbotId: 'clpl60296000qhoqiqwkmn0y5',
  }
</script>

<body>
  <h1 class="text-3xl font-bold underline">
    Hello world!
  </h1>
  <script src="http://localhost:3000/chatbot.js"></script>
  <!-- ... other body elements ... -->
</body>

</html>
```

Nextjs
```js
"use client"

import Script from 'next/script'
import React, { useEffect } from 'react';


export default function Home() {
  useEffect(() => {
    // Set your global variable here
    window.chatbotConfig = {
      chatbotId: "clpl60296000qhoqiqwkmn0y5"
    };

  }, []);

  return (
    <main className="">
      <Script src="https://chatbot-5a94.vercel.app/chatbot.js" strategy="afterInteractive" />

    </main>
  )
}
```
