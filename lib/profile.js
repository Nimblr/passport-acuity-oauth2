/**
 * Parse profile.
 *
 * @param {object|string} json
 * @return {object}
 * @access public
 */
exports.parse = function (json) {
    if ('string' == typeof json) {
        json = JSON.parse(json);
    }

    var profile = {};
    profile.id = json.id;
    profile.displayName = json.name || '';
    profile.emails = [{value: json.email}];

    return profile;
};
