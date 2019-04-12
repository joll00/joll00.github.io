// form validation

bootstrapValidate('#addRestaurantName', 'min:1:Enter restaurant name')
bootstrapValidate('#addRestaurantPhone', 'max:12: Must be a valid phone number! ')
bootstrapValidate('#addRestaurantPostcode', 'max:9: Must be a valid postcode! ')
bootstrapValidate('#addRestaurantText', 'min:30: Enter at least 30 characters! ')