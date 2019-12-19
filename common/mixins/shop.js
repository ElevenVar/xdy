export default {
	data () {
		return {
			debounceTimer: '' //防抖定时器
		}
	},
	methods: {
		// 防抖函数
		debounce (fn) {
		  var arg = Array.from(arguments).splice(1)
		  clearTimeout(this.debounceTimer)
		  this.debounceTimer = setTimeout(() => {
			fn.apply(this, arg)
		  }, 500)
		}
	},
	filters: {
		type (str) {
			if (str == 1) {
				return '满减'
			} else if (str == 2) {
				return '多买优惠'
			} else if (str == 3) {
				return '满赠'
			} else if (str == 4) {
				return '套装'
			}
		},
		regskuPropertyName (str) {
			return str.replace(/,/g, '/')
		},
		price (str) {
			if(str % 100 == 0) {
				return String(str/100)+'.00'
			} else if(str % 10 == 0) {
				return String(str/100)+'0'
			} else {
				let num = String((str/100).toFixed(3))
				return num.substr(0, num.length-1)
			}
		}
	}
}