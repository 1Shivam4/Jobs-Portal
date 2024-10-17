This is an basic website for any user to post and control the Job postings in this website

### To Run it Locally

1. Install NodeJs and Git bash in your system and mongodb along with compass community server
2. Open the file in any IDE's or Code Editor
3. Open Terminal and run -> npm i -y or npm i

## Adding Data

1. Make sure your database is installed successfully
2. Add config.env file into your root directory

add ->

NODE_ENV=development
PORT=3000

DATABASE="mongodb://127.0.0.1:27017/restro"

JWT_SECRET="this-is-a-nice-horse-with-face-like-an-cow-elephant"
JWT_EXPIRES_IN=5d
JWT_COOKIE_EXPIRES_IN=5

TWILLIO_NUMBER='+19187791031'
TWILLIO_SID="YOUR TWillo SID"
TWILLIO_AUTH="YOUR Twillio Authentication"

3. After this step
   go to your terminal and run -> npm start

   you should see -> App is running at port 3000
   connected to MongoDB

4. Now terminate the process by using -> CTRL + C

### Adding Bulk data into your database

1. Cd into the dev-data folder -> cd dev-data/
2. Now run -> node importDevData.js --delete

Deletes any existing data

3. Now run -> node importDevData.js --import

Imports all the data into your database

### now Cd back to your root directory

cd ..
run -> npm start

4. You can use your application now
