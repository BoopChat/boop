# Testing Google Login

1. Login

   - Upon clicking the "Continue with Google" button, you will be redirected to Google's login page.
   - Sign into Google with your prefered Google account.
   - After successfully signing in to Google, you will be redirected to the Boop Chat's messenger page.
   - A cookie containing your login information will be stored on your browser for future sign in.
   - While logged in, if you close the Boop chat messenger tab, then reopen the application, you will
     be automatically logged in and directed to the messenger page.

2. Logout

   - From the messenger page, click the circular profile image photo on the left sidebar menu.
   - This opens a secondary sidebar with the logout button.
   - Click the red door icon with the arrow to log out.
   - The cookie containing your login information will be deleted.

3. View Cookie (optional)

   - Inspect any of the Boop chat pages.
   - Navigate to the "Application" tab.
   - On the left, select "Cookies" then http://localhost:3000.
   - On the right, Select "loginCookie".
   - To the bottom, check the "show URL decoded" cookie value to view the stored login information.
   - Additionally the cookie can also be deleted from here to log out.
   - Right click on the loginCookie and select delete.
