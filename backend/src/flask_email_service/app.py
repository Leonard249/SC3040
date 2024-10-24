from flask import Flask, request, jsonify
from flask_mail import Mail, Message
import os
from dotenv import load_dotenv

app = Flask(__name__)
load_dotenv()

# Configuration for Flask-Mail
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME')
app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')
app.config['MAIL_DEFAULT_SENDER'] = os.getenv('MAIL_DEFAULT_SENDER')

mail = Mail(app)

@app.route('/api/send-reset-email', methods=['POST'])
def send_reset_email():
    data = request.get_json()
    email = data.get('email')
    token = data.get('token')

    if not email or not token:
        return jsonify({"error": "Email and token are required"}), 400

    try:
        msg = Message("Password Reset Request",
                      recipients=[email])
        msg.body = f"Please use the following token to reset your password: {token}"
        mail.send(msg)
        return jsonify({"message": "Password reset email sent successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route('/api/send-invite-link', methods=['POST'])
def send_invite_link():
    data = request.get_json()
    email = data.get('email')
    group_name = data.get('group_name')
    pending_user_id = data.get('pending_user_id')

    if not email or not group_name or not pending_user_id:
        return jsonify({"error": "Email, group name, and link are required"}), 400

    try:
        msg = Message(f"Invitation to join {group_name}",
                      recipients=[email])
        msg.body = f"You have been invited to join the group '{group_name}'! Click the link below to join:\n\n{os.environ.get('SERVER')}?id={pending_user_id}"
        mail.send(msg)
        return jsonify({"message": "Invitation link sent successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
if __name__ == '__main__':
    app.run(debug=True)
