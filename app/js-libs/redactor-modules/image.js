if (!RedactorPlugins) var RedactorPlugins = {};

//This plugin has been altered for images instead of video
//Decision due to imagemanager plugin too featured

(function($)
{
	RedactorPlugins.imageurl = function()
	{
		return {
			getTemplate: function()
			{
				return String()
				+ '<section id="redactor-modal-video-insert">'
					+ '<label>Image url</label>'
					+ '<textarea id="redactor-insert-video-area" style="height: 160px;"></textarea>'
				+ '</section>';
			},
			init: function()
			{
				console.log('init')
				var button = this.button.addAfter('indent', 'image', 'Insert image');
				this.button.addCallback(button, this.imageurl.show);
			},
			show: function()
			{
				this.modal.addTemplate('imageurl', this.imageurl.getTemplate());

				this.modal.load('imageurl', 'Insert image', 700);
				this.modal.createCancelButton();

				var button = this.modal.createActionButton(this.lang.get('insert'));
				button.on('click', this.imageurl.insert);

				this.selection.save();
				this.modal.show();

				$('#redactor-insert-video-area').focus();

			},
			insert: function()
			{
				var data = $('#redactor-insert-video-area').val();
				this.image.insert('<img src="' + data + '"">');
			}

		};
	};
})(jQuery);