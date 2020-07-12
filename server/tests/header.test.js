const Page = require("./helpers/CustomPage")

let page

beforeEach(async () => {
   page = await Page.build()
   await page.goto("http://localhost:3000/")
});

afterEach(async () => {
   await page.close();
});

test('header name is correct', async () => {
   const text = await page.getContentsOf(".brand-logo")
   expect(text).toEqual("Blogster")
});

test('login with google account', async () => {
   await page.click(".right a")
   const url = await page.url()

   expect(url).toMatch(/accounts.google.com/)
});

test('Signed in, shows the logout button', async () => {

   await page.login()

   const blogsText = await page.getContentsOf(".right a")

   expect(blogsText).toEqual("My Blogs")

   const logoutText = await page.getContentsOf('a[href="/auth/logout"]')

   expect(logoutText).toEqual("Logout")

});
