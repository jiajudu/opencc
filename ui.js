new Vue({
    el: '#app',
    data: {
        src_text: '',
        dst_text: '',
        src_locale: 'cn',
        dst_locale: 'tw',
    },
    methods: {
        change: function() {
            this.dst_text = convert(this.src_locale, this.dst_locale, this.src_text);
        }
    }
})