from flask import Flask, jsonify, request
import pandas as pd
from xgboost import XGBRegressor
from xgboost import XGBClassifier
from sklearn.model_selection import train_test_split

app = Flask(__name__)

# Endpoint to handle a POST request
@app.route('/success-prediction', methods=['POST'])
def post_example():
    # Get JSON data from the request
    data = request.get_json()
    
    df = pd.read_csv('output.csv')

    custom_data = pd.DataFrame({
    'age_first_funding_year': [data['age_first_funding_year']],
    'age_last_funding_year': [data['age_last_funding_year']],
    'age_first_milestone_year': [data['age_first_milestone_year']],
    'age_last_milestone_year': [data['age_last_milestone_year']],
    'relationships': [data['relationships']],
    'funding_rounds': [data['funding_rounds']],
    'funding_total_usd': [data['funding_total_usd']],
    'milestones': [data['milestones']],
    'has_roundA': [data['has_roundA']],
    'has_roundB': [data['has_roundB']],
    'has_roundC': [data['has_roundC']],
    'has_roundD': [data['has_roundD']],
    'avg_participants': [data['avg_participants']],
    'is_top500': [data['is_top500']],
    'category_code_advertising': [data['category_code_advertising']],
    'category_code_analytics': [data['category_code_analytics']],
    'category_code_automotive': [data['category_code_automotive']],
    'category_code_biotech': [data['category_code_biotech']],
    'category_code_cleantech': [data['category_code_cleantech']],
    'category_code_consulting': [data['category_code_consulting']],
    'category_code_ecommerce': [data['category_code_ecommerce']],
    'category_code_education': [data['category_code_education']],
    'category_code_enterprise': [data['category_code_enterprise']],
    'category_code_fashion': [data['category_code_fashion']],
    'category_code_finance': [data['category_code_finance']],
    'category_code_games_video': [data['category_code_games_video']],
    'category_code_hardware': [data['category_code_hardware']],
    'category_code_health': [data['category_code_health']],
    'category_code_hospitality': [data['category_code_hospitality']],
    'category_code_manufacturing': [data['category_code_manufacturing']],
    'category_code_medical': [data['category_code_medical']],
    'category_code_messaging': [data['category_code_messaging']],
    'category_code_mobile': [data['category_code_mobile']],
    'category_code_music': [data['category_code_music']],
    'category_code_network_hosting': [data['category_code_network_hosting']],
    'category_code_news': [data['category_code_news']],
    'category_code_other': [data['category_code_other']],
    'category_code_photo_video': [data['category_code_photo_video']],
    'category_code_public_relations': [data['category_code_public_relations']],
    'category_code_real_estate': [data['category_code_real_estate']],
    'category_code_search': [data['category_code_search']],
    'category_code_security': [data['category_code_security']],
    'category_code_semiconductor': [data['category_code_semiconductor']],
    'category_code_social': [data['category_code_social']],
    'category_code_software': [data['category_code_software']],
    'category_code_sports': [data['category_code_sports']],
    'category_code_transportation': [data['category_code_transportation']],
    'category_code_travel': [data['category_code_travel']],
    'category_code_web': [data['category_code_web']],
    })
    # Selecting the target column
    y = df['status']  
    X = df.drop('status', axis=1)
    # Selecting the test size from total dataset (0.2 = 20%)
    X_train, X_test, y_train, y_test = train_test_split(X, y, random_state = 10, test_size=0.2)

    xg_reg = XGBRegressor()
    xg_reg.fit(X_train, y_train)

    y_pred = xg_reg.predict(custom_data).tolist()
    return jsonify(message=y_pred)

if __name__ == '__main__':
    app.run(debug=True)
