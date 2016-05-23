const hbs = require('handlebars');

//  ### Flash Message Helper
//  KeystoneJS supports a message interface for information/errors to be passed from server
//  to the front-end client and rendered in a html-block.  FlashMessage mirrors the Jade Mixin
//  for creating the message.  But part of the logic is in the default.layout.  Decision was to
//  surface more of the interface in the client html rather than abstracting behind a helper.
//
//  @messages:[]
//
//  *Usage example:*
//  `{{#if messages.warning}}
//      <div class="alert alert-warning">
//          {{{flashMessages messages.warning}}}
//      </div>
//   {{/if}}`

module.exports = function flashMessages(messages) {
	let output = '';
	for (let i = 0; i < messages.length; i++) {
		if (messages[i].title) {
			output += '<h4>' + messages[i].title + '</h4>';
		}

		if (messages[i].detail) {
			output += '<p>' + messages[i].detail + '</p>';
		}

		if (messages[i].list) {
			output += '<ul>';
			for (let ctr = 0; ctr < messages[i].list.length; ctr++) {
				output += '<li>' + messages[i].list[ctr] + '</li>';
			}
			output += '</ul>';
		}
	}
	return new hbs.SafeString(output);
};
