class DatePicker{


	//确立标准，年月日。内部存储中的年是四位正常
	//月份是从0开始，显示的时候进行加1。变更的时候使用new Date(yyyy,mm,dd)中的月份，也是从0开始


	constructor(_id){
		this.id = _id
		this.main = this.$(_id)
		this.isOpen = false
		this.currenDate = new Date()
		this.activeDate = new Date(this.main.getAttribute('date-value'))
		this.year = this.currenDate.getFullYear()
		this.month = this.currenDate.getMonth()
		this.day = this.currenDate.getDate()
		this.init()
	}

	init(){
		document.body.onclick = _=>{
			this.mainClose();
		}
		this.initStyle()
		this.createMain();
		this.main.appendChild(this.createInput({
			onclick:_=>{
				this.mainOpen(_.clientY)
				_.stopPropagation()
			}
		}))

		this.mainOpen();
	}

	//打开或者关闭弹框
	mainOpen(_y){
		let topY = _y || this.main.offsetTop
		let top = this.main.offsetTop - 350 > window.scrollY ? '-350px' : (this.main.offsetHeight + 5) + 'px'
		this.$('date-main').style.top = top
		this.$('date-main').style.transform = "scaleY(1)"
	}

	mainClose(){
		this.$('date-main').style.transform = "scaleY(0)"
	}

	//初始化样式
	initStyle(){
		let dateStyle = this.$('date-style')
		if(!dateStyle){
			const mainStyle = `
				#${this.id}{
					position:relative;
					color:#666;
				}
				.date-main{
					position:absolute;
					width:324px;
					height:auto;
					border:1px solid #ddd;
					border-radius:8px;
					box-shadow:0px 0px 2px #ccc;
					transform:scaleY(0);
					transform-origin:center 5px;
					transition:all .3s;
				}

				.date-main:hover{
					box-shadow:0px 2px 8px #ccc;
					transform:translateY(-2px);
				}

				.date-header{
					padding:12px;
					display:flex;
					border-bottom:1px solid #ddd;
				}

				.date-header span{
					display:block;
					flex:1;
					text-align:center;
					cursor:pointer;
				}

				.date-header span:hover{
					color:#409EFF;
				}

				.date-header span.date-header-year{
					flex:20px;
				}

				.date-header-1::after{
					content: "⇤";
				}
				.date-header-2::after{
					content: "⇠";
				}
				.date-header-3::after{
					content: "⇢";
				}
				.date-header-4::after{
					content: "⇥";
				}

				.date-body{
					padding:0px 12px;
					overflow:hidden;
				}

				.date-week-title{
					padding:0px 12px;
				}

				.date-body span{
					font-size:12px;
					display:block;
					float:left;
					width:20px;
					height:20px;
					line-height:20px;
					text-align:center;
					cursor: pointer;
					box-sizing:border-box;
					margin:11px;
				}

				.date-body span:hover{
					color:#409EFF;
				}

				.date-body span.other{
					color:#ccc;
				}

				

				.date-body span.curren{
					color:#409EFF;
					border-radius:50%;
				}

				.date-body span.other + .curren{
					color:#ccc;
				}

				.date-body span.active{
					color:#fff;
					background-color:#409EFF;
					border-radius:50%;
				}

				.date-body span.year{
					width: 37px;
				    line-height: 100%;
				    height: 28px;
				}

				.date-body span.month{
					width:70px;
					line-height:40px;
					height:40px;
				}
			`
			dateStyle = document.createElement('style')
			dateStyle.type = "text/css"
			dateStyle.id = "date-style"
			dateStyle.appendChild(document.createTextNode(mainStyle))
		}
		document.getElementsByTagName('head')[0].appendChild(dateStyle)
	}

	
	//创建主体
	createMain(){
		let config = {
			id:'date-main',
			className:'date-main'
		}
		let dom = document.createElement('div')
		dom = Object.assign(dom,config)
		dom.onclick = _=>{
			_.stopPropagation();
		}
		dom.appendChild(this.createHeader())
		dom.appendChild(this.createWeekTitle())
		dom.appendChild(this.createBody())
		this.main.appendChild(dom)
		this.renderBody()
	}

	//创建头部

	createHeader(){
		let config = {
			id:'date_header',
			className:'date-header'
		}
		let dom = document.createElement('div')
		dom = Object.assign(dom,config)
		let buttons = [{
			tag:'span',
			id:'date_header_prev_year',
			className:'date-header-1',
			onclick:_=>{
				this.updateDate(new Date(this.year-1,this.month,this.day))
			}
		},{
			tag:'span',
			id:'date_header_prev_month',
			className:'date-header-2',
			onclick:_=>{
				this.updateDate(new Date(this.year,this.month-1,this.day))
			}
		},
		{
			tag:'span',
			id:'date_header_year',
			className:'date-header-year',
			innerHTML: this.year + '年',
			onclick:_=>{
				this.openSelectYear(this.year)
			}
		}
		,
		{
			tag:'span',
			id:'date_header_month',
			className:'date-header-month',
			innerHTML: this.month + 1 + '月',
			onclick:_=>{
				this.openSelectMonth(this.month)
			}
		},
		{
			tag:'span',
			id:'date_header_next_month',
			className:'date-header-3',
			onclick:_=>{
				this.updateDate(new Date(this.year,this.month+1,this.day))
			}
		},
		{
			tag:'span',
			id:'date_header_next_year',
			className:'date-header-4',
			onclick:_=>{
				this.updateDate(new Date(this.year+1,this.month,this.day))
			}
		}
		]

		for(let button of buttons){
			let span = document.createElement(button.tag)
			span = Object.assign(span,button)
			dom.appendChild(span)
		}

		return dom
	}

	updateDate(_date){
		this.year = _date.getFullYear()
		this.month = _date.getMonth()

		this.$('date_header_year').innerHTML = this.year + '年'
		this.$('date_header_month').innerHTML = this.month + 1 + '月'
		//console.log('date:',_date,this.year,this.month)
		this.renderBody()
	}

	//创建星期头部
	createWeekTitle(){
		const titles = ['日','一','二','三','四','五','六']
		let config = {
			id:'date_week_title',
			className:'date-body date-week-title'
		}
		let dom = document.createElement('div')
		dom = Object.assign(dom,config)
		
		for(let title of titles){
			dom.appendChild(Object.assign(document.createElement('span'),{innerHTML:title}))
		}

		return dom
	}

	
	//创建主体
	createBody(){
		let config = {
			id:'date_body',
			className:'date-body'
		}
		let dom = document.createElement('div')
		dom = Object.assign(dom,config)
		return dom
	}

	renderBody(){
		let firstDay = new Date(this.year,this.month,1).getDay();
		this.$('date_body').innerHTML = ""
		let i = 1;
		
		for(let i=1; i<43; i++){
			let date = new Date(this.year,this.month, i-firstDay)
			let dom = document.createElement('span')
			dom.innerHTML = date.getDate()

			if (new Date().getDate() == date.getDate()) {
				dom.classList.add('curren')
			}

			if(date.getMonth() != this.month){
				dom.classList.add('other')
			}
			
			if(date.getMonth() == this.activeDate.getMonth() && date.getFullYear() == this.activeDate.getFullYear() && date.getDate() == this.activeDate.getDate()){
				dom.classList.add('active')
			}


			dom.onclick = _=>{
				console.log(_)
				this.activeDate = date
				this.updateDate(date)
				this.main.lastChild.value = date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate()
				this.mainClose()
			}
			this.$('date_body').appendChild(dom)
		}	
	}

	//选择年
	openSelectYear(){
		this.$('date_body').innerHTML = ""
		for(let i=0; i<25; i++){
			let year = this.year-12+i
			let config = {
				classList:'year',
				innerHTML:year,
				onclick:_=>{
					this.year = year
					this.updateDate(new Date(year,this.month,this.day))
				}
			}

			if (this.year == year) {
				config.classList = 'year curren'
			}
			this.$('date_body').appendChild(Object.assign(document.createElement('span'),config))
		}
	}
	
	//选择月
	openSelectMonth(){
		const txt = ['一','二','三','四','五','六','七','八','九','十','十一','十二']
		this.$('date_body').innerHTML = ""
		for(let i=0; i<12; i++){
			let config = {
				classList:'month',
				innerHTML:txt[i]+'月',
				onclick:_=>{
					this.month = i
					this.updateDate(new Date(this.year,this.month,this.day))
				}
			}

			if (this.month == i) {
				config.classList = 'month curren'
			}
			this.$('date_body').appendChild(Object.assign(document.createElement('span'),config))
		}
	}

	//创建iput框
	createInput(_config = {}){
		let config = {type:'text',value:''}
		let dom = document.createElement('input')
		dom = Object.assign(dom,_config,config)
		return dom
	}

	//基础函数
	$(_id){
		return document.getElementById(_id)
	}
}