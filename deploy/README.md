# How to deploy client and server to Heroku?

1. Prerequisites
  - Install Heroku CLI
  - Login to Heroku (Currently, our server is in Eunki's personal account. please talk to Eunki)
  - Build for deploy (see `($PROJECT_HOME)/build.sh` and `($PROJECT_HOME)/README.md`)

2. Client

Start at current directory.
`cd client-deploy`
`git add .`
`git push heroku master`

3. Server
   
Start at current directory.
`cd server-deploy`
`git add .`
`git push heroku master`

4. Additional: local test

Start at current directory.
  - client
    `cd client-deploy`
    `heroku local`
  - server (it will be nice to use another terminal)
    `cd server-deploy`
    `npm install`
    `heroku local -p 4001`
