'use babel';

// notice data is not being loaded from a local json file
// instead we will fetch suggestions from this URL
const BASE_URL = 'https://raw.githubusercontent.com/concon121/atom-boto3-autocomplete/master/data/';
const SERVICES_URL = 'https://raw.githubusercontent.com/concon121/atom-boto3-autocomplete/master/data/services.json';

class AdvancedProvider {
  constructor() {
    // offer suggestions only when editing plain text or HTML files
    this.selector = '.text.plain, .text.html.basic';

    // except when editing a comment within an HTML file
    this.disableForSelector = '.text.html.basic .comment';

    // make these suggestions appear above default suggestions
    this.suggestionPriority = 2;
  }

  getSuggestions(options) {
    const {
      editor,
      bufferPosition
    } = options;

    // getting the prefix on our own instead of using the one Atom provides
    let prefix = this.getPrefix(editor, bufferPosition);

    // all of our snippets start with "@"

    console.log('Checking...', prefix)
    return this.findMatchingSuggestions(prefix);

  }

  getPrefix(editor, bufferPosition) {
    // the prefix normally only includes characters back to the last word break
    // which is problematic if your suggestions include punctuation (like "@")
    // this expands the prefix back until a whitespace character is met
    // you can tweak this logic/regex to suit your needs
    let line = editor.getTextInRange([
      [bufferPosition.row, 0], bufferPosition
    ]);
    let match = line.match(/\S+$/);
    return match ? match[0] : '';
  }

  findMatchingSuggestions(prefix) {
    // using a Promise lets you fetch and return suggestions asynchronously
    // this is useful for hitting an external API without causing Atom to freeze
    return new Promise((resolve) => {
      // fire off an async request to the external API

      var toMatch = prefix;
      var service = prefix;

      var url;
      if (prefix.includes('.')) {
        service = prefix.split('.')[0]
        toMatch = prefix.split('.')[1]
        url = BASE_URL + service + '.json'
      } else {
        url = SERVICES_URL
      }

      fetch(url)
        .then((response) => {
          // convert raw response data to json
          return response.json();
        })
        .then((json) => {
          console.log(json)

          // filter json (list of suggestions) to those matching the prefix
          let matchingSuggestions = json.filter((suggestion) => {
            console.log(suggestion)
            return suggestion.displayText.startsWith(toMatch);
          });

          // bind a version of inflateSuggestion() that always passes in prefix
          // then run each matching suggestion through the bound inflateSuggestion()
          let inflateSuggestion = this.inflateSuggestion.bind(this, prefix);
          let inflatedSuggestions = matchingSuggestions.map(inflateSuggestion);

          console.log(inflateSuggestion, inflatedSuggestions)

          // resolve the promise to show suggestions
          resolve(inflatedSuggestions);
        })
        .catch((err) => {
          // something went wrong
          console.log(err);
        });
    });
  }

  // clones a suggestion object to a new object with some shared additions
  // cloning also fixes an issue where selecting a suggestion won't insert it
  inflateSuggestion(replacementPrefix, suggestion) {
    console.log(suggestion.provider)
    var description = null;
    if (suggestion.description) {
      description = suggestion.description.replace(new RegExp('\\n', 'g'), '\n').replace(new RegExp('\\t', 'g'), '\t')
    }
    return {
      displayText: suggestion.displayText,
      snippet: suggestion.snippet,
      type: suggestion.type,
      description: description,
      descriptionMoreURL: suggestion.descriptionMoreURL || null
    };
  }
}
export default new AdvancedProvider();
