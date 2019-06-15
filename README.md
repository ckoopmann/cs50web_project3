# Project 2
This repository contains the code for project 2 of *CS50's Web Programming with Python and JavaScript* implementing the *Flack* messaging application.

## Files

This repository contains the following relevant files:

* `static/index.js` contains the javascript code to run client side.
* `main.css` contains some static css code controlling the appearance of the application
* `templates/index.html` contains the html code to be served by the flask application
*`application.py`  contains the python code for the slack code to run server side.
* `requirements.txt` contains a list of dependencies for the python code to be installed via `pip install -r requirements.txt`


## Usage

To use the application do the following steps:

1. Install dependencies with `pip install -r requirements.txt`
1. Set flask app environment variable `export FLASK_APP=application.py`
1. Start flask app `flask run`
1. Navigate in your browser to `localhost:5000`

After having entered a username you can then create channels, write / read messages etc.

## Personal Touch / Search Message

As a personal touch I have added a function to the client side code to search through all messages in the current channel.

By entering a search term in the text input field and clicking the search button the displayed messages are filtered to contain only those whose body contains the entered string.

To see all messages again one has to click the reset button, after which you can search for a different string using the same functionality again.
