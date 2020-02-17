import os
import sys
import flask
true = True
false = False


app = flask.Flask(__name__)

print("Server coming online...")
app.config['TEMPLATES_AUTO_RELOAD'] = True

@app.route("/")
def Home():
    return flask.render_template("Home.html")


if __name__ == "__main__":
    app.run(debug=False, host='0.0.0.0');
