# run.py
from app import create_app

# Pass the correct relative path to the config file
app = create_app()

if __name__ == '__main__':
    app.run(host='0.0.0.0',debug=True)
    pass
