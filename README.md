# fdc3-examples

Some example apps that you can use with FDC3

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
