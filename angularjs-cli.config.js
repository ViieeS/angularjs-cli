module.exports = {

    js: {export_name_case: 'pascal'},

    css: {export_name_case: 'kebab'},

    html: {export_name_case: 'kebab'},

    get es6() {
        return this.js;
    },

    get scss() {
        return this.css;
    }
}