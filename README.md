# fdc3-examples

Some example apps that you can use with FDC3.

CRM Examples: http://localhost:5173/directory/crm-examples.directory.json
Intent Examples: http://localhost:5173/directory/intent-examples.directory.json

# Branch Details

- `step-1`: Configuring some basic libraries.

  > Set up this project named "FDC3 Examples", it needs to use vite, typescript ShadCN and tailwind. You can use the common-cloud-controls/website/package.json to help if you need to see another project with some of these features

- `step-2` add some CRM functionality.

  > n a data directory, create a JSON file for a CRM database. It should have fields first name, last name, email address, linked in URL, company name and a notes field. You should populate with the following people: Eteri Dvalishvili <eteri.dvalishvili@finos.org>, Win Morgan <win.morgan@finos.org>, Jane Gavronsky <jane.gavronsky@finos.org>, Luca Borella <luca.borella@finos.org>, Rob Moffat <robmoffat@mac.com>, Karl Moll <karl.moll@finos.org> all of these work for FINOS as you can see. Add a notes field with some humorous notes for each one.

  > this is awesome. Create interactions as a field in each one. It should be an array. Each interaction should have a date and some notes about what the interaction was. Your humour is on point. Keep going.

  > Neat. Now we're going to need the front page to display this list of characters. Create a table including first name, last name and company. You should be able to load this data from the crm.json file.

  > this doesn't look like it uses tailwind styling

- `step-3` Added details page. Adding FDC3 functionality.

  > ok, let's create a page where you can see each individual and all the details about them. Add a table for the list of interactions. Link this back to the first name field on the index page

  > add the FDC3 library. Broadcast the `fdc3.contact` type each time the details pane is opened. @https://fdc3.finos.org/docs/context/ref/Contact

  > ok. Don't use window.fdc3. Instead, use getAgent(). It returns a promise with the DesktopAgent object inside it. getAgent() is idempotent

  > @benzinga.json ok, to test out our new CRM with FDC3, we're going to need a directory. This will need to be hosted by vite on some URL for Sail to access it. Take a look at the benzinga.json file to see an example of an app directory entry. We'll need one of these for our Super-Duper CRM

- `step-4` Set up ngrok, updated app directory.

- `step-5` Fixed ngrok urls, moved the app onto /crm. Github profiles.

  > ok, time for a new application: github profiles. I want you to create a new page that connects to FDC3 and adds a context listener for the contact type. When it receives the context, it does a search of github using a URL like this: @https://api.github.com/search/users?q=win+morgan github returns JSON in this format: ...

  > add a new application for the github profiles

- `step-6` Chat application

  > ok, we now need a third example app, a chat app. So, let's create some data to hold the previous chats. For four of the people in the CRM, I want you to create a JSON file for the chat info, named firstname_lastname.json. In this create sample chat records. It should be an array with fields time, a boolean for who is talking and the message.

  > create a screen to open the chat with the chat messages displayed if they exist.

- `step-7` FDC3 for Chat Application

> now, I want you to do the FDC3 integation for the chat app. It's the same for both pages, so do it in a file that we can pull in to both the main list and the detail page. Do getClient() then add a context handler for the fdc3.contact. If the contact is in the list of chats, open it otherwise open a new chat with the contact.

# Fidelity Demo

- Added the intent raiser and intent resolver demos, which also use private channel functionality.
