# STEPS TO INSTALL node-postgres

1. `npm init -y`
2. `npm install pg`

# STEPS TO CREATE BASIC STRUCTURE

1. import from pg
2. create a client which have:

- user(username)
- host(host name)
- database(db name)
- password(db password)
- port(default 5432)

3. async main function with try/catch/finally

- try:
  1. connect to the database
  2. send/run the query
  3. check the result
- catch:
  1. if error, console log/print it
- finally:
  1. close the connection(disconnect)

4. Call/run the main function

# STEPS TO RUN THE FILE

1. `node Phase-1/index.js`
