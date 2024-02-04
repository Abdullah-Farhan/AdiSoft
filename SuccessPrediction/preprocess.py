import pandas as pd

df = pd.read_csv('startup_data.csv')

unique_values = df['category_code'].unique()
df = df.replace(to_replace=['closed', 'acquired'], value=[0,1])
print(df.head())
print(unique_values)

# Removing all the columns not required
df = df.drop('Unnamed: 0', axis=1)
df = df.drop('state_code', axis=1)
df = df.drop('latitude', axis=1)
df = df.drop('longitude', axis=1)
df = df.drop('zip_code', axis=1)
df = df.drop('id', axis=1)
df = df.drop('city', axis=1)
df = df.drop('Unnamed: 6', axis=1)
df = df.drop('name', axis=1)
df = df.drop('founded_at', axis=1)
df = df.drop('closed_at', axis=1)
df = df.drop('first_funding_at', axis=1)
df = df.drop('last_funding_at', axis=1)
df = df.drop('state_code.1', axis=1)
df = df.drop('is_top500', axis=1)
df = df.drop('labels', axis=1)
df = df.drop('is_software', axis=1)
df = df.drop('is_web', axis=1)
df = df.drop('is_mobile', axis=1)
df = df.drop('is_enterprise', axis=1)
df = df.drop('is_advertising', axis=1)
df = df.drop('is_gamesvideo', axis=1)
df = df.drop('is_ecommerce', axis=1)
df = df.drop('is_biotech', axis=1)
df = df.drop('is_consulting', axis=1)
df = df.drop('is_othercategory', axis=1)
df = df.drop('is_CA', axis=1)
df = df.drop('is_NY', axis=1)
df = df.drop('is_MA', axis=1)
df = df.drop('is_TX', axis=1)
df = df.drop('is_otherstate', axis=1)
df = df.drop('object_id', axis=1)
df = df.drop('has_angel', axis=1)
df = df.drop('has_VC', axis=1)


# Creating new columns based on the value of each column to aviod providing importance based on value
dummies = pd.get_dummies(df['category_code'], prefix='category_code')

# Concatenate the dummy columns with the original DataFrame
df = pd.concat([df, dummies], axis=1)

# Add 1 if the row belongs to that category, otherwise add 0
for category in dummies.columns:
    df[category] = df[category].apply(lambda x: 1 if x == 1 else 0)

# Drop the original 'Category' column
df = df.drop('category_code', axis=1)

df.to_csv('output.csv', index=False)