class Validator {
    
    static CORRECT_NEWS_API_TOPICS = ["business","entertainment","general","health","science","sports","technology"]
    
    static CORRECT_NEWS_API_COUNTRIES = ["ae","ar","at","au","be","bg","br","ca","ch","cn","co","cu","cz","de","eg","fr",
    "gb","gr","hk","hu","id","ie","il","in","it","jp","kr","lt","lv","ma","mx","my","ng","nl","no","nz","ph","pl","pt",
    "ro","rs","ru","sa","se","sg","si","sk","th","tr","tw","ua","us","ve","za"]

    static validateNewUserInfo( userInfo, userData ) {
        if(userInfo.hasOwnProperty("email") &&
            userInfo.hasOwnProperty("password") &&
            userInfo.hasOwnProperty("preferred_country") &&
            userInfo.hasOwnProperty("preferred_topic") &&
            this.validateEmail(userInfo.email) &&
            this.validatePassword(userInfo.password) &&
            this.validateTopic(userInfo.preferred_topic) &&
            this.validateCountry(userInfo.preferred_country) &&
            this.validateUniqueUser(userInfo.email, userData)) {
                return {
                    "status" : true,
                    "response_message" : "User registered succesfully"
                }
            } 
            else if (!this.validateEmail(userInfo.email)) {
                return {
                    "status" : false,
                    "response_message" : "Invalid email"
                }
            }
            else if (!this.validatePassword(userInfo.password)) {
                return {
                    "status" : false,
                    "response_message" : "Invalid password"
                }
            }
            else if (!this.validateTopic(userInfo.preferred_topic)) {
                return {
                    "status" : false,
                    "response_message" : "Invalid topic"
                }
            }
            else if (!this.validateCountry(userInfo.preferred_country)) {
                return {
                    "status" : false,
                    "response_message" : "Invalid country"
                }
            }
            else if (!this.validateUniqueUser(userInfo.email, userData)) {
                return {
                    "status" : false,
                    "response_message" : "User already exists"
                }
            }
    }

    static validatePreferencesUpdate( userInfo, userData ) {
        if(userInfo.hasOwnProperty("preferred_country") &&
            userInfo.hasOwnProperty("preferred_topic") &&
            this.validateTopic(userInfo.preferred_topic) &&
            this.validateCountry(userInfo.preferred_country) 
        ) {
            return {
                "status": true,
                "response_message": "Preferences updated succesfully"
            }
        } else if (!this.validateTopic(userInfo.preferred_topic)) {
            return {
                "status" : false,
                "response_message" : "Invalid topic"
            }
        }
        else if (!this.validateCountry(userInfo.preferred_country)) {
            return {
                "status" : false,
                "response_message" : "Invalid country"
            }
        }
    }

    static validateEmail(email) {
        const validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        
        if( email.match(validRegex) ) {
            return true;
        } else {
            return false;
        }
    }

    static validatePassword(password) {
        if (password.length >= 8) {
            return true;
        } else {
            return false;
        }
    }

    static validateTopic(topic) {
        return this.CORRECT_NEWS_API_TOPICS.includes(topic);
    }

    static validateCountry(country) {
        return this.CORRECT_NEWS_API_COUNTRIES.includes(country);
    }

    static validateUniqueUser(userEmail, userData) {
        const userFound = userData.find(user => user.email === userEmail)
        if (userFound) {
            return false;
        } else {
            return true;
        }
    }
}

module.exports = Validator;