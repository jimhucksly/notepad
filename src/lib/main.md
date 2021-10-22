# Vue
## Vue  + Webpack Init

```
yarn global add @vue/cli @vue/cli-service-global

vue init webpack my-project
```

## Установка Nuxt

```
yarn add -g @vue/cli 
yarn create nuxt-app <project-name>
yarn add sass-loader node-sass -D
```

## Plugin for Vue
```

import store from '@/store'

var Plugin = function _plugin(options) {
  if(options === void 0) options = {}
}

function install(Vue) {
  const func1 = () => {}

  const func2 = (ref) => {}

  const result = {
    func1,
    func2
  }

  if(!Vue.prototype.hasOwnProperty('$plugin')) {
    Object.defineProperty(Vue.prototype, '$plugin', {
      get: function get() { return result }
    })
  }
}

Plugin.install = install
export default Plugin
```

### подключение
```
import Plugin from '../plugin.js'
Vue.use(Plugin)
```

### использование
```
this.$plugin.func1()
this.$plugin.func2()
```

## vue-shim.d.ts
```
import Vue from 'vue'
import * as Vuex from 'vuex'
import { RootState } from 'store/types'

declare module "*.vue" {
  export default Vue
}

declare module 'vue/types/vue' {
  interface Vue {
    $store: Vuex.Store<RootState>
    $electron: any,
    $slideUp: Function,
    $slideDown: Function
  }
}

declare global {
  namespace NodeJS {
    interface Process {
      client: boolean
    }
  }
}
```

## types
```

import _ from 'lodash'

...

const fetched = [
  'user',
  'user.companies',
  'user.gallery'
]

interface IZipObject {
  fetch: string
  fetching: string
  get: string
  set: string
}

const types = ((): IZipObject => {
  const o: IZipObject = {
    fetch: '',
    fetching: '',
    get: '',
    set: ''
  }
  
  const types = ['fetch', 'fetching', 'get', 'set']

  const fill = (ob: object, key: string): void => {
    const zip: IZipObject = {
      fetch: '',
      fetching: '',
      get: '',
      set: ''
    }
    types.forEach((t: string) => {
      switch(t) {
        case 'fetching':
          zip[t] = ('is_' + key.replace(/\./g, '_') + '_' + t).toUpperCase()
          break
        default:
          zip[t] = (t + '_' + key.replace(/\./g, '_')).toUpperCase()
      }
    })
    ob = _.merge(o, _.zipObjectDeep([key], [zip]))
  }

  [...fetched].forEach(i => {
    if(/\./.test(i)) {
      const _root = i.split('.')[0]
      if(o[_root] === undefined) o[_root] = {}
      fill(o[_root], i)
    } else {
      if(o[i] === undefined) o[i] = {}
      fill(o[i], i)
    }
  })
  return o
})()

```

### getters

```
import { $types, $fetched } from '@/api'

...

const getters = {}

...

$fetched.forEach(route => {
  /**
   * @param {String s = 'user.companies'}
   * @return {String a = IS_USER_COMPANIES_FETCHING}
   */
  const fetchingGetterKey = ('is_' + route.replace(/\./g, '_') + '_fetching').toUpperCase()
  /** */

  route = route.split('.')
  /**
   * @param {Array a = ['user', 'companies']}
   * @return {String s = userCompanies}
   */
  const t = lowerFirst(route.map(c => upperFirst(c)).join(''))
  /** */

  let getter

  if(route.length === 1) {
    getter = $types[route.join('')].get
  } else {
    /**
     * @param {Array a = ['user', 'companies']}
     * @return { o = Obj['user']['companies'] }
     */
    let pointer = $types[route[0]]
    route.splice(0, 1)
    route.forEach(k => { pointer = pointer[k] })
    /** */

    getter = pointer.get
  }

  getters[getter] = (state) => {
    return state[t]
  }

  /**
   * @param {String s = userCompanies}
   * @return {String a = isUserCompaniesFetching}
   */
  const fetchingStateKey = 'is' + upperFirst(t) + 'Fetching'
  /** */

  getters[fetchingGetterKey] = (state) => {
    return state[fetchingStateKey]
  }
})

export default getters
```

### mutations

```
import { $types, $fetched } from '@/api'

...

const mutations = {}

...

$fetched.forEach(route => {
  const keys = route.split('.')
  let commitKey = null

  /**
   * @param {Array a = ['user', 'companies']}
   * @return {String s = userCompanies}
   */
  const stateKey = lowerFirst(keys.map(c => upperFirst(c)).join(''))
  /** */

  if(keys.length === 1) {
    commitKey = $types[keys.join('')].set
  } else {
    /**
     * @param {Array a = ['user', 'companies']}
     * @return { o = Obj['user']['companies'] }
     */
    let pointer = $types[keys[0]]
    keys.splice(0, 1)
    keys.forEach(k => { pointer = pointer[k] })
    /** */

    commitKey = pointer.set
  }

  if(mutations[commitKey] === undefined) {
    mutations[commitKey] = (state, data) => {
      state[stateKey] = data
    }
  }

  /**
   * @param {String s = 'user.companies'}
   * @return {String a = IS_USER_COMPANIES_FETCHING}
   */
  const _commitKey = ('is_' + route.replace(/\./g, '_') + '_fetching').toUpperCase()
  /** */

  /**
   * @param {String a = 'user.companies'}
   * @return {String s = isUserCompaniesFetching}
   */
  const _stateKey = 'is' + keys.map(c => upperFirst(c)).join('') + 'Fetching'
  /** */

  mutations[_commitKey] = (state, flag) => {
    state[_stateKey] = flag
  }
})

export default mutations
```

### state

```

import { $fetched } from '@/api'
import { upperFirst, lowerFirst } from '@/helpers/util'

...

const state = () => {

	const _state = {}
	const fetching = {}
	
	$fetched.forEach(key => {
    /**
     * @param {String a = user.companies}
     * @return {String s = UserCompanies}
     */
    const t = key.split('.').map(c => upperFirst(c)).join('')
    /** */

    if(_state[lowerFirst(t)] === undefined) {
      fetching[lowerFirst(t)] = null
      fetching[`is${t}Fetching`] = false
    }
  })
  
  return {
    ..._state,
    ...fetching
  }
}

export default state
```

### types(modules)

```
const fetched = {
  'tours': [
		'a', 
		'b'
	],
	'hotels': [
		'a', 
		'b'
	]
}
	
	const types = ((): any => {
    const o: any = {}
    const tt: string[] = ['fetch', 'fetching', 'get', 'set']

	  const fill = (ob: object, key: string, prefix: string): void => {
		const zip: IZipObject = {
		  fetch: '',
		  actionName: '',
		  fetching: '',
		  get: '',
		  getterName: '',
		  set: '',
		  commitName: ''
		}
		tt.forEach((t: string) => {
		  switch(t) {
			case 'fetching':
			  zip[t] = (prefix ? `${prefix}/` : '') + ('is_' + key.replace(/\./g, '_') + '_' + t).toUpperCase()
			  break
			case 'fetch':
			  zip.actionName = (t + '_' + key.replace(/\./g, '_')).toUpperCase()
			  zip[t] = (prefix ? `${prefix}/` : '') + zip.actionName
			  break
			case 'get':
			  zip.getterName = (t + '_' + key.replace(/\./g, '_')).toUpperCase()
			  zip[t] = (prefix ? `${prefix}/` : '') + zip.getterName
			case 'set':
			  zip.commitName = (t + '_' + key.replace(/\./g, '_')).toUpperCase()
			  zip[t] = (prefix ? `${prefix}/` : '') + zip.commitName
			  break
		  }
		})
		ob = _.merge(o[prefix], _.zipObjectDeep([key], [zip]))
	  }

	  Object.keys(fetched).forEach((key: string) => {
		o[key] = {}
		const fetchlist = fetched[key]
		fetchlist.forEach((i: string) => {
		  if(/\./.test(i)) {
			const Root = i.split('.')[0]
			if(o[key][Root] === undefined) o[key][Root] = {}
			fill(o[key][Root], i, key)
		  } else {
			if(o[key][i] === undefined) o[key][i] = {}
			fill(o[key][i], i, key)
		  }
		})
	  })
	  return o
	})()

```

### getters factory

```
import { types, fetched } from '~/api/types.ts'
import { upperFirst, lowerFirst } from '~/utils/common.ts'

class GettersFactory {
  module: string
  fetchlist: string[]
  types: string[]
  regexp: RegExp

  constructor(_module: string) {
    this.module = _module
    this.fetchlist = fetched[_module]
    this.types = types[_module]
    this.regexp = new RegExp('^' + _module + '\/', 'g')
  }

  public build() {
    const o: any = {}
    this.fetchlist.forEach((route: string) => {
      /**
       * @param {String s = 'user.permissions'}
       * @return {String a = IS_USER_PERMISSIONS_FETCHING}
       */
      const fetchingGetterKey: string = ('is_' + route.replace(/\./g, '_') + '_fetching').toUpperCase()
      /** */

      const routeSplitted: string[] = route.split('.')
      /**
       * @param {Array a = ['user', 'permissions']}
       * @return {String s = userPermissions}
       */
      const t: string = lowerFirst(routeSplitted.map(c => upperFirst(c)).join(''))
      /** */

      let getter: string = ''

      if(routeSplitted.length === 1) {
        getter = this.types[routeSplitted.join('')].get.replace(this.regexp, '')
      } else {
        /**
         * @param {Array a = ['user', 'permissions']}
         * @return { o = Obj['user']['permissions'] }
         */
        let pointer: any = this.types[routeSplitted[0]]
        routeSplitted.splice(0, 1)
        routeSplitted.forEach(k => { pointer = pointer[k] })
        /** */

        getter = pointer.get.replace(this.regexp, '')
      }

      o[getter] = (state: any) => {
        return state[t]
      }

      /**
       * @param {String s = userPermissions}
       * @return {String a = isUserPermissionsFetching}
       */
      const fetchingStateKey: string = 'is' + upperFirst(t) + 'Fetching'
      /** */

      o[fetchingGetterKey] = (state: any) => {
        return state[fetchingStateKey]
      }
    })
    return o
  }
}

export default GettersFactory
```

### mutations factory

```
import { types, fetched } from '~/api/types.ts'
import { upperFirst, lowerFirst } from '~/utils/common.ts'

class MutationsFactory {
  module: string
  fetchlist: string[]
  types: string[]
  regexp: RegExp

  constructor(_module: string) {
    this.module = _module
    this.fetchlist = fetched[_module]
    this.types = types[_module]
    this.regexp = new RegExp('^' + _module + '\/', 'g')
  }

  public build() {
    const o: any = {}
    this.fetchlist.forEach(route => {
      const keys: string[] = route.split('.')
      let commitKey: string = ''

      /**
       * @param {Array a = ['user', 'permissions']}
       * @return {String s = userPermissions}
       */
      const stateKey: string = lowerFirst(keys.map(c => upperFirst(c)).join(''))
      /** */

      if(keys.length === 1) {
        commitKey = this.types[keys.join('')].set.replace(this.regexp, '')
      } else {
        /**
         * @param {Array a = ['user', 'permissions']}
         * @return { o = Obj['user']['permissions'] }
         */
        let pointer: any = this.types[keys[0]]
        keys.splice(0, 1)
        keys.forEach(k => { pointer = pointer[k] })
        /** */

        commitKey = pointer.set.replace(this.regexp, '')
      }

      if(o[commitKey] === undefined) {
        o[commitKey] = (state: any, data: any) => {
          state[stateKey] = data
        }
      }

      /**
       * @param {String s = 'user.permissions'}
       * @return {String a = IS_USER_PERMISSIONS_FETCHING}
       */
      const _commitKey: string = ('is_' + route.replace(/\./g, '_') + '_fetching').toUpperCase()
      /** */

      /**
       * @param {String a = 'user.permissions'}
       * @return {String s = isUserPermissionsFetching}
       */
      const _stateKey: string = 'is' + keys.map(c => upperFirst(c)).join('') + 'Fetching'
      /** */

      o[_commitKey] = (state: any, flag: boolean) => {
        state[_stateKey] = flag
      }
    })
    return o
  }
}

export default MutationsFactory

```

### use factory (getters.js)

```
import GettersFactory from '~/utils/GettersFactory.ts'

const getters = {
}

const _getters = new GettersFactory('tours')

export default {
  ..._getters.build(),
  ...getters
}

```

## Шпаргалка по ORM
```
const user = User.query()
	.with('posts.comments') // nested relation
	.with('posts.comments|reviews') // Fetching all comments & reviews from user.posts
	.with('profile').with('posts') // 2 разные связи
	.with(['posts.comments', 'posts.reviews', 'profile']) // пример сложного запроса
	.with('posts.*') // Fetches all relations of all posts.
	.withAll() // with all
	.withAllRecursive() // по умолчанию 3 уровня, но вроде параметром можно указать количество
	.with('posts', (query) => {
		query.where('published', true) // Только с опубликованными постами
	})
	.with('posts.comments', (query) => {
		// с постами
		// и только теми комментами к постам, у которых тип rewiev
		query.where('type', 'review')
	})
	.get()
```

# Cookie
## set
```
/**
* set cookie
**/
export function setCookie(key, value, expires){
    let time = 0;
    switch (expires) {
        case 'month':
            time = 1000*60*60*24*30;
        break;
    }
    time = new Date(new Date().getTime() + time);
    config.debug && console.log(`set cookie -> ${key} | ${value} | ${expires}`)
    document.cookie = key + "="+ value +"; path=/; expires=" + time.toUTCString()
}
```
## get
```
/**
* get cookie
**/
export function getCookie(key){
    let _key = key.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1');
    let matches = document.cookie.match(new RegExp("(?:^|; )" + _key + "=([^;]*)"));
    if(matches && matches[1] && matches[1].length) return matches[1]
    return null
}
```
## delete
```
/**
* delete cookie
**/
export function deleteCookie(key){
    document.cookie = key + "=; path=/; expires=-1"
}
```

# CSS
## Анимации keyframes
```
@-webkit-keyframes name_ {
	from {text-shadow: 0 0 3px black;}
	50% {text-shadow: 0 0 30px black;}
	to {text-shadow: 0 0 3px black;}
}
@keyframes name_ {
	from {text-shadow: 0 0 3px black;}
	50% {text-shadow: 0 0 30px black;}
	to {text-shadow: 0 0 3px black;}
}

div {
	font-size: 3.5em;
	color: darkmagenta;
	-webkit-animation: name_  2s infinite ease-in-out;
	animation: name_  2s infinite ease-in-out;
}

//краткая запись анимации

	
animation: animation-name animation-duration animation-timing-function 
		animation-delay animation-iteration-count animation-direction;


div {
-webkit-animation-name: mymove;
animation-name: mymove;

-webkit-animation-duration: 2s;
animation-duration: 2s;

-webkit-animation-timing-function: linear; //временная функция
animation-timing-function: linear;

ease	Функция по умолчанию, анимация начинается медленно, разгоняется быстро и замедляется в конце. 
	Соответствует cubic-bezier(0.25,0.1,0.25,1).
linear	Анимация происходит равномерно на протяжении всего времени, без колебаний в скорости. 
	Соответствует cubic-bezier(0,0,1,1).
ease-in	Анимация начинается медленно, а затем плавно ускоряется в конце. Соответствует cubic-bezier(0.42,0,1,1).
ease-out	Анимация начинается быстро и плавно замедляется в конце. Соответствует cubic-bezier(0,0,0.58,1).
ease-in-out	Анимация медленно начинается и медленно заканчивается. Соответствует cubic-bezier(0.42,0,0.58,1).
cubic-bezier(x1, y1, x2, y2)	Позволяет вручную установить значения от 0 до 1. 
	На этом сайте вы сможете построить любую траекторию скорости изменения анимации.
step-start	Задаёт пошаговую анимацию, разбивая анимацию на отрезки, изменения происходят в начале каждого шага. 
	Эквивалентно steps(1, start).
step-end	Пошаговая анимация, изменения происходят в конце каждого шага. Эквивалентно steps(1, end).
steps(количество шагов,start|end)	Ступенчатая временная функция, которая принимает два параметра. 
	Количество шагов задается целым положительным числом. Второй параметр необязательный, указывает момент, 
	в котором начинается анимация. Со значением start анимация начинается в начале каждого шага, 
	со значением end — в конце каждого шага с задержкой. Задержка вычисляется как результат деления времени 
	анимации на количество шагов. Если второй параметр не указан, используется значение по умолчанию end.
initial	Устанавливает значение свойства в значение по умолчанию.
inherit	Наследует значение свойства от родительского элемента.

-webkit-animation-delay: 2s; 
animation-delay: 2s;

-webkit-animation-iteration-count: 3; //число повторений // infinite - бесконечно
animation-iteration-count: 3;

-webkit-animation-direction: alternate; //направление анимации
animation-direction: alternate;

alternate	Анимация проигрывается с начала до конца, затем в обратном направлении.
alternate-reverse	Анимация проигрывается с конца до начала, затем в обратном направлении.
normal	Значение по умолчанию, анимация проигрывается в обычном направлении, с начала и до конца.
reverse	Анимация проигрывается с конца.
initial	Устанавливает значение свойства в значение по умолчанию.
inherit	Наследует значение свойства от родительского элемента.

}

//управление анимацией

paused	Останавливает анимацию.
running	Значение по умолчанию, означает проигрывание анимации.
initial	Устанавливает значение свойства в значение по умолчанию.
inherit	Наследует значение свойства от родительского элемента.

div:hover {
-webkit-animation-play-state: paused;
animation-play-state: paused; 
}

//состояние элемента до и после анимации

none	Значение по умолчанию. Состояние элемента не меняется до или после воспроизведения анимации.
forwards	Воспроизводит анимацию до последнего кадра по окончанию последнего повтора и не 
	отматывает ее к первоначальному состоянию.
backwards	Возвращает состояние элемента после загрузки страницы к первому кадру, даже если 
	установлена задержка animation-delay, и оставляет его там, пока не начнется анимация.
both	Позволяет оставлять элемент в первом ключевом кадре до начала анимации 
	(игнорируя положительное значение задержки) и задерживать на последнем кадре до конца последней анимации.
initial	Устанавливает значение свойства в значение по умолчанию.
inherit	Наследует значение свойства от родительского элемента.

div {
-webkit-animation-fill-mode: forwards; 
animation-fill-mode: forwards;
}

//множественные анимации

div {animation: shadow 1s ease-in-out 0.5s alternate, move 5s linear 2s;}
```

## Стилизация скролла
```
::-webkit-scrollbar-button {
	background-image:url('');
	background-repeat:no-repeat;
	width:8px;
	height:0px;
	border-radius: 5px;
}

::-webkit-scrollbar-track {
	background-color:#ecedee
}

::-webkit-scrollbar-thumb {
	-webkit-border-radius: 5px;
	border-radius: 5px;
	background-color: rgba(0,0,0,0.4);
}

::-webkit-scrollbar-thumb:hover{
	background-color:#56999f;
}

::-webkit-resizer{
	background-image:url('');
	background-repeat:no-repeat;
	width:14px;
	height:0px
}

::-webkit-scrollbar{
	width: 10px;
}

```

### scss
```
@each $elem in (
  '.class1', '.class2', 'textarea'
) {
  #{$elem}::-webkit-scrollbar-button {
    background-image: url('') !important;
    background-repeat: no-repeat !important;
    width: 10px !important;
    height: 0px !important;
  }
  #{$elem}::-webkit-scrollbar-track {
    background-color:#eee !important;
  }
  #{$elem}::-webkit-scrollbar-thumb {
    -webkit-border-radius: 0px !important;
    border-radius: 0px !important;
    background-color: $blue_light !important;
    cursor: default;
  }
  #{$elem}::-webkit-scrollbar-thumb:hover {
    background-color: $blue_light !important;
    cursor: default;
  }
  #{$elem}::-webkit-resizer {
    background-image :url('') !important;
    background-repeat: no-repeat !important;
    width: 10px !important;
    height: 0px !important;
  }
  #{$elem}::-webkit-scrollbar {
    width: 10px !important;
  }
}
```

## Миксин шрифтов
```
@mixin mix-font-face ($font_name, $font_file) {
  font-family: $font_name;
  src: url('/fonts/#{$font_file}.eot');
  src: url('/fonts/#{$font_file}.eot?#iefix') format('embeded-opentype');
  src: local('O'), url('/fonts/#{$font_file}.woff') format('woff'),
  url('/fonts/#{$font_file}.svg') format('svg'),
  url('/fonts/#{$font_file}.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
}

@font-face {
  @include mix-font-face('Lato', Lato-Regular);
}
```

## Миксин margin/padding
```
@for $i from 1 through 10 {
  @each $n, $name in ('m': 'margin', 'p':'padding') {
    @each $t, $type in ('t': 'top', 'r': 'right', 'b': 'bottom', 'l': 'left') {
      .#{$n}-#{$t}-#{$i*5} {
        #{$name}-#{$type}: #{$i*5}px;
      }
      .-#{$n}-#{$t}-#{$i*5} {
        #{$name}-#{$type}: -#{$i*5}px;
      }
      .#{$n}-#{$t}-#{$i*5}-i {
        #{$name}-#{$type}: #{$i*5}px !important;
      }
      .-#{$n}-#{$t}-#{$i*5}-i {
        #{$name}-#{$type}: -#{$i*5}px !important;
      }
    }
    @each $t, $types in ('x': ('left', 'right'), 'y': ('top', 'bottom')) {
      .#{$n}-#{$t}-#{$i*5} {
        @each $type in $types {
          #{$name}-#{$type}: #{$i*5}px;
        }
      }
      .#{$n}-#{$t}-#{$i*5}-i {
        @each $type in $types {
          #{$name}-#{$type}: #{$i*5}px !important;
        }
      }
    }
    .#{$n}-#{$i*5} {
      #{$name}: #{$i*5}px;
    }
    .#{$n}-#{$i*5}-i {
      #{$name}: #{$i*5}px !important;
    }
  }
}
```

## Цвет placeholder
```
::-webkit-input-placeholder {color:#FF0000;}
::-moz-placeholder {color:#FF0000;}
:-moz-placeholder {color:#FF0000;}
:-ms-input-placeholder {color:#FF0000;}
```

# GIT
## переход на другой диск
```
cd /d d:\Folder
```

## Окончания строк в git 
замена CRLF на LF на виндоус (окончания строк)
```
git config --global core.autocrlf input
```

## Замена редактора
```
git config --global core.editor notepad
```

## Добавление сабмодуля
```
git submodule add --git url-- --path--
```

## Загрузка сабмодулей
```
git submodule foreach git pull origin master
```

# isQuotaExceeded
```
/**
* clear storage when quota is exceeded
**/
export function isQuotaExceeded(e){
    let quotaExceeded = false;
        if (e) {
            if (e.code) {
                switch (e.code) {
                    case 22:
                        quotaExceeded = true;
                        break;
                    case 1014:
                        // Firefox
                        if (e.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
                            quotaExceeded = true;
                        }
                        break;
                }
            } else if (e.number === -2147024882) {
                quotaExceeded = true;
            }
        }
    return quotaExceeded;
}
```

# Price format
```
/**
* price format
**/
export function priceBeautify(price) {
  let p = price.toString()
  if(p.indexOf(',') > 0) p = p.replace(/\,/g, '.')

  let res
  try {
    res = parseFloat(p)
  } catch(error) {
    throw new Error('argument is not numeric')
  }

  if(isNaN(res)) throw new Error('argument is not numeric')

  res = res.toFixed(2)
  res = res.toString().split('.')

  res[0] = res[0].replace(/(\d{1,3}(?=(\d{3})+(?:\.\d|\b)))/g, '\$1 ')

  if(res[1] === '00') res = res[0]
  else res = [res[0], res[1]].join(',')

  return res
}
```

# Строка в правильном падеже
```
/**
* get the word in the right case after digit
* @param {Number} n
* @param {String} CASE_NOMINATIVE
* @param {String} CASE_GENITIVE
* @param {String} PLURAL
* example: pluralize(12, отзыв, отзыва, отзывов)
* @return {String} => 12 отзывов
**/
export function pluralize(n, CASE_NOMINATIVE, CASE_GENITIVE, PLURAL) {
  // например: (28, 'сайт', 'сайта', 'сайтов') => 28 сайтов
  const n2 = Math.abs(n) % 100
  const n1 = n % 10
  if(n2 > 10 && n2 < 20) { return `${n} ${PLURAL}` }
  if(n1 > 1 && n1 < 5) { return `${n} ${CASE_GENITIVE}` }
  if(+n1 === +1) { return `${n} ${CASE_NOMINATIVE}` }
  return `${n} ${PLURAL}`
}
```

# Транслит
```
/**
* translit rus->eng
**/
export function translit(val) {
  const space = '_'
  /* eslint-disable object-property-newline */
  const transl = {
    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'e', 'ж': 'zh',
    'з': 'z', 'и': 'i', 'й': 'j', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n',
    'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'kh',
    'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch', 'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'ju',
    'я': 'ja', ' ': space, '_': space, '`': space, '~': space, '!': space, '@': space,
    '#': space, '$': space, '%': space, '^': space, '&': space, '*': space,
    '(': space, ')': space, '-': space, '\=': space, '+': space, '[': space,
    ']': space, '\\': space, '|': space, '/': space, '.': space, ',': space,
    '{': space, '}': space, '\'': space, '"': space, '': space, ':': space,
    '?': space, '<': space, '>': space, '№': space
  }
  /* eslint-enable object-property-newline */
  let result = ''
  let curentSim = ''
  const text = val.toLowerCase()

  text.split('').forEach((s, i) => {
    if(transl[text[i]] !== undefined) {
      if(curentSim !== transl[text[i]] || curentSim !== space) {
        result += transl[text[i]]
        curentSim = transl[text[i]]
      }
    } else {
      result += text[i]
      curentSim = text[i]
    }
  })

  return result.trim()
}
```

# Drag & Drop File Loader
```
/**
 * handle func forload files through drag&drop
 */
export function dragAndDropLoader(DOMElementId, CSSClassHighlight, Callback) {
  const id = DOMElementId
  const $id = '#' + DOMElementId
  const cls = CSSClassHighlight
  const cb = Callback

  const dropArea = document.getElementById(id)

  if(dropArea) {
    const overlay = document.createElement('div')
    overlay.classList.add('drop-overlay')
    dropArea.appendChild(overlay)

    dropArea.ondragenter = function(e) {
      e.preventDefault()
      e.stopPropagation()
      if(!dropArea.classList.contains(cls)) {
        dropArea.classList.add(cls)
        overlay.style.display = 'block'
      }
    }

    dropArea.ondragover = function(e) {
      e.preventDefault()
      e.stopPropagation()
      if(!dropArea.classList.contains(cls)) {
        dropArea.classList.add(cls)
        overlay.style.display = 'block'
      }
    }

    document.ondragover = function(e) {
      e.preventDefault()
      e.stopPropagation()

      if(e.target.closest($id) == null) {
        if(dropArea.classList.contains(cls)) {
          dropArea.classList.remove(cls)
          overlay.style.display = 'none'
        }
      }
    }

    dropArea.ondragleave = function(e) {
      e.preventDefault()
      e.stopPropagation()
    }

    document.ondrop = function(e) {
      e.preventDefault()
      e.stopPropagation()
    }

    dropArea.ondrop = function(e) {
      e.preventDefault()
      e.stopPropagation()
      cb(e)
      if(dropArea.classList.contains(cls)) {
        dropArea.classList.remove(cls)
        overlay.style.display = 'none'
      }
    }
  }
}
```

# Drag & Drop Sorting

```
<div class="cont">
	<div
		  v-for="item in items"
		  :key="item.id"
		  class="item"
		  :data-id="item.id"
		  @mousedown="move($event, item.id)"
		  >
		  ...
	</div>
</div>

...

protected move(event: MouseEvent, id: string): void | null {
    if(event.which !== 1) {
      // если клик правой кнопкой мыши
      return // то он не запускает перенос
    }
	
	const contClassName = 'cont
	const elemsClassName = 'item'
    const container: HTMLElement | null = document.querySelector('.' + contClassName)
    
    if(!container || container.childElementCount === 1) return null
    const elem: HTMLElement | null = document.querySelector(`[data-id="${id}"]`)
    if(!elem) return null

    document.onmouseup = () => {
      elem.style.transform = 'scale(1)'
	  
      <!!! click event handler !!!>
	  
      setTimeout(() => {
        elem.removeAttribute('style')
      }, 100)
    }

    elem.style.transition = 'all 0.1s'
    elem.style.transform = 'scale(0.95)'

    const startPos = {
      x: event.clientX,
      y: event.clientY
    }

    document.onmousemove = (ev: MouseEvent) => {
      if(Math.abs(ev.clientX - startPos.x) > 10 || Math.abs(ev.clientY - startPos.y) > 10) {
        container.classList.add(contClassName + '--drag')

        const avatar: HTMLElement = document.createElement('div')
        avatar.style.display = 'block'
        avatar.style.float = 'left'
        avatar.style.width = elem.offsetWidth + 'px'
        avatar.style.height = elem.offsetHeight + 'px'
        avatar.style.margin = '3px'
        avatar.style.border = '1px dashed #333'
        avatar.style.opacity = '0.6'

        const rectElem: DOMRect = elem.getBoundingClientRect()
        const rectCont: DOMRect = container.getBoundingClientRect()
        const startX = rectElem.left - rectCont.left
        const startY = rectElem.top - rectCont.top

        container.insertBefore(avatar, elem)
        elem.style.position = 'absolute'
        elem.style.left = startX + 'px'
        elem.style.top = startY + 'px'
        elem.style.zIndex = '99'
        elem.style.opacity = '0.7'
        elem.style.transform = 'rotate(7deg)'

        container.childNodes.forEach((el: any) => {
          if(el.classList) {
            const isAvatar = el.classList.contains('dragable-avatar')
            const isSelf = el.classList.contains('dragable')
            if(!isAvatar && !isSelf && el.classList.contains(elemsClassName)) el.classList.add('dropable')
          }
        })

        const dragItem: HTMLElement = elem

        const finishDrag = () => {
          dragItem.classList.remove('dragable')
          dragItem.removeAttribute('style')
          container.querySelectorAll('.dropable').forEach((el: any) => {
            el.classList.remove('dropable')
            el.removeAttribute('style')
          })
          container.classList.remove(contClassName + '--drag')
          container.insertBefore(dragItem, avatar)
          container.removeChild(avatar)
          document.onmousemove = null
          document.onmouseup = null
          this.setOrder()
        }

        document.onmousemove = (e: MouseEvent): void | null => {
          const moveX = startPos.x - e.clientX
          const moveY = startPos.y - e.clientY

          dragItem.style.left = startX - moveX + 'px'
          dragItem.style.top = startY - moveY + 'px'

          const { clientX, clientY } = e
          dragItem.style.display = 'none'
          const el: Element | null = document.elementFromPoint(clientX, clientY)
          dragItem.style.display = 'block'
          if(el === null) return null
          const dropItem = el.closest('.dropable')
          if(dropItem === null) return null
          const dropRect: DOMRect = dropItem.getBoundingClientRect()
          const dropCoords = {
            x: e.clientX - dropRect.left,
            y: e.clientY - dropRect.top,
          }
          if(dropCoords.x < dropRect.width / 2) {
            const next: Element | null = dropItem.nextElementSibling
            if(next) {
              container.insertBefore(avatar, next)
            } else container.appendChild(avatar)
          } else {
            if(indexOf(dropItem) === container.childElementCount - 1) {
              container.appendChild(avatar)
            } else {
              container.insertBefore(avatar, dropItem)
            }
          }
        }

        document.onmouseup = (e: MouseEvent): void | null => {
          const { clientX, clientY } = e
          dragItem.style.display = 'none'
          const el = document.elementFromPoint(clientX, clientY)
          dragItem.style.display = 'block'
          // такое возможно, если курсор мыши "вылетел" за границу окна
          if(el === null) {
            finishDrag()
            return null
          }
          finishDrag()
        }
      }
    }
  }
```

# Slide with Anime.js
```
import anime from 'animejs'

var Anime = function _anime(options) {
  if(options === void 0) options = {}
}

function install(Vue) {
  const slideDown = (el, duration = 300) => {
    el.style.overflow = 'hidden'
    el.style.display = 'block'
    el.style.visibility = 'hidden'
    const h = el.offsetHeight
    el.style.height = '0px'
    el.style.visibility = 'visible'
    anime({
      targets: el,
      height: h,
      easing: 'linear',
      duration: duration,
      complete() {
        el.attributes.removeNamedItem('style')
      }
    })
  }

  const slideUp = (el, duration = 300) => {
    el.style.overflow = 'hidden'
    anime({
      targets: el,
      height: 0,
      easing: 'linear',
      duration: duration,
      complete() {
        el.attributes.removeNamedItem('style')
        el.style.display = 'none'
      }
    })
  }

  if(!Vue.prototype.hasOwnProperty('$slideDown')) {
    Object.defineProperty(Vue.prototype, '$slideDown', {
      get: function get() { return slideDown }
    })
  }

  if(!Vue.prototype.hasOwnProperty('$slideUp')) {
    Object.defineProperty(Vue.prototype, '$slideUp', {
      get: function get() { return slideUp }
    })
  }
}

Anime.install = install
export default Anime
```

# Extended Moment
```
import moment from 'moment'

function extendedMoment(date) {
  return Object.setPrototypeOf(moment(date), extendedMoment.prototype)
}

Object.setPrototypeOf(extendedMoment.prototype, moment.prototype)
Object.setPrototypeOf(extendedMoment, moment)

extendedMoment.prototype.toUTC = function toString() {
  return this.format('YYYY-MM-DDTHH:mm:ssZ')
}

extendedMoment.locale('ru')

export default ({ app }, inject) => {
  inject('moment', extendedMoment)
}
```

# Генератор ID
```
/**
 * generate id
 */

export function uniqueid(len) {
  if(len === undefined) len = 16
  let idstr = String.fromCharCode(Math.floor((Math.random() * 25) + 65))
  do {
    // between numbers and characters (48 is 0 and 90 is Z (42-48 = 90)
    const ascicode = Math.floor((Math.random() * 42) + 80)
    if(ascicode < 58 || (ascicode > 64 && ascicode < 91) || ascicode > 96) {
      // exclude all chars between : (58) and @ (64)
      idstr += String.fromCharCode(ascicode)
    }
  } while(idstr.length < len)
  return (idstr)
}
```

## по заданному формату
```
/**
* password generation
**/
export function passwordGen(len, format){
    let pass = ''
    let strong = len
    let dic = ''
    if(format) {
        switch(format) {
            case 'a-z':
                dic = "abcdefghijklmnopqrstuvwxyz";
            break;
            case 'A-Z':
                dic = "ABCDEFGHIJKLMNOPQRSTUWVXYZ";
            break;
            case '0-9':
                dic = "1234567890";
            break;
            case 'a-zA-Z':
                dic = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUWVXYZ";
            break;
            case 'a-z0-9':
                dic = "abcdefghijklmnopqrstuvwxyz1234567890";
            break;
            case 'A-Z0-9':
                dic = "ABCDEFGHIJKLMNOPQRSTUWVXYZ1234567890";
            break;
            case 'a-zA-Z0-9':
                dic = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUWVXYZ1234567890";
            break;
        }
    } else dic = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUWVXYZ1234567890";

    for (let i = 0; i < strong; i++)
        pass += dic.charAt(Math.floor(Math.random() * dic.length));
    return pass
}
```

# Текст без тэгов
```
/**
 * clear text without tags
 */

export function getClearText(text, limit) {
  let result
  try {
    result = decodeURI(text)
  } catch(error) {
    result = text
  }
  result = result.replace(/<\/?[^>]+>/g, '').replace(/&mdash/g, '-').replace(/&laquo|&raquo/g, '"').replace(/&nbsp/g, ' ')
  if(limit !== undefined) {
    try {
      result = result.slice(0, parseInt(limit)) + '...'
    } catch(e) {
      console.error(e)
    }
  }
  return result
}
```

# Index of HTMLElement
```
export const indexOf = (DOMElement) => {
  let result = -1
  if(!DOMElement) return -1
  if(DOMElement.classList) {
    DOMElement.classList.add('index-of-element-search-proc')
  } else return -1
  const parent = DOMElement.parentNode
  if(!parent) return -1
  if(!parent.childNodes) return -1
  if(parent.childNodes.length === 1) return 0
  const children = []
  parent.childNodes.forEach(el => {
    if(el.tagName) children.push(el)
  })
  if(!children.length) return -1
  children.forEach((elem, i) => {
    if(elem.classList) {
      if(elem.classList.contains('index-of-element-search-proc')) {
        elem.classList.remove('index-of-element-search-proc')
        result = i
      }
    }
  })
  return result
}
```

# Обработка ввода только цифр
```
/**
 * необходимая разметка для успешной работы миксина
 * <input
 *  v-model="model"
 *  name="model"
    @input="testCardNumberHandler">

    также необходимо:
    data() {
      return {
        model: '',
        cardNumberToSplit: 3
      }
    }
*/

testCardNumberHandler(event) {
      const value = event.target.value.replace(/[^0-9]/g, '')
			const formattedValue = ... тут можно добаувить дополнительную обработу
      this[event.target.name] = formattedValue
      return false
    },
```


# URI Parser
```
// parseUri 1.2.2
// (c) Steven Levithan <stevenlevithan.com>
// MIT License
interface IParseUriOptions {
  strictMode: boolean
  key: string[]
  q: {
    name: string
    parser: RegExp
  }
  parser: {
    strict: RegExp
    loose: RegExp
  }

}
const parseUriOptions: IParseUriOptions = {
  strictMode: false,
  key: ['source','protocol','authority','userInfo','user','password','hostname','port','relative','path','directory','file','query','anchor'],
  q:   {
      name:   'queryKey',
      parser: /(?:^|&)([^&=]*)=?([^&]*)/g
  },
  parser: {
      strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
      loose:  /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
  }
}

const parseURI = (queryString: string) => {
  function parse_uri(str: string) {
    const o: IParseUriOptions = parseUriOptions
    const m: any = o.parser[o.strictMode ? 'strict' : 'loose'].exec(str)
    const uri: object = {}
    let i: number = 14
    while (i--) uri[o.key[i]] = m[i] || ''
    uri[o.q.name] = {}
    uri[o.key[12]].replace(o.q.parser, ($0: string, $1: string, $2: string) => {
      if ($1) uri[o.q.name][$1] = $2
    })
    return uri
  }
  return parse_uri(queryString)
}
```

# Превью изображения
```
onFileChange(e) {
      var files = e.target.files || e.dataTransfer.files
      var reader = new FileReader()
      reader.onload = (e) => {
        this.img = e.target.result
      }
      this.fileImg = files[0]
      reader.readAsDataURL(files[0])
}
```

# CamelCase to _underscore

```
const camelCaseKeysToUnderscore = (obj) => {
      const isObj = (o) => {
        return Object.prototype.toString.call(o) === '[object Object]'
      }
      const isArr = (o) => {
        return Object.prototype.toString.call(o) === '[object Array]'
      }
      if(!isObj(obj) && !isArr(obj)) return obj
      for(const oldName in obj) {
        const newName = oldName
          .replace(/([A-Z])/g, function($1) { return '_' + $1.toLowerCase() })
        if(newName !== oldName) {
          if(obj[oldName] !== undefined) {
            obj[newName] = obj[oldName]
            delete obj[oldName]
          }
        }
        if(isObj(obj[newName])) {
          obj[newName] = camelCaseKeysToUnderscore(obj[newName])
        }
        if(isArr(obj[newName])) {
          obj[newName] = obj[newName].map(item => {
            return camelCaseKeysToUnderscore(item)
          })
        }
      }
      return obj
    }
```

# Uppercase first char
```
/**
 * set uppercase of first char
 */
export const upperFirst = (s) => {
  if(s.toString === undefined) return ''
  s = s.toString()
  if(!s.length) return ''
  return s.charAt(0).toUpperCase() + s.slice((s.length - 1) * -1)
}
```

# Lowercase first char
```
/**
 * set lowercase of first char
 */
export const lowerFirst = (s) => {
  if(s.toString === undefined) return ''
  s = s.toString()
  if(!s.length) return ''
  return s.charAt(0).toLowerCase() + s.slice((s.length - 1) * -1)
}
```
# Скрытие блока по esc
```
document.onkeydown = (e) => {
        if(e.keyCode === 27 || e.code === 'Escape') {
          this.user_info_show = !this.user_info_show
          document.onclick = null
          document.onkeydown = null
        }
      }
```

# Последовательное выполнение промисов
```
const f1 = function() {
  return new Promise(function(resolve) {
    ...
  });
}

const f2 = function() {
  return new Promise(function(resolve) {
    ...
  });
}

const f3 = function() {
  return new Promise(function(resolve) {
    ...
  });
}

const runner = async (promises: [() => void]): Promise<any>  => {
      promises.unshift(async (): Promise<any> => {
        await Promise.all([])
        return true
      })
      try {
        await promises.reduce(async (p, deed) => {
          try {
            const sResponse: any = await p
            if(sResponse instanceof Error) throw new Error(sResponse)
          } catch(e) {
            console.log(e)
            return null
          }
          return deed()
        }, promises[0]())
        return true
      } catch (e) {
        await Promise.reject(e)
        return null
      }
    }

runner([f1, f2, f3])
```

# Ручное разрешение промисов

```
let resolveFunc;
const promise = new Promise(resolve => {
  resolveFunc = resolve;
});
setTimeout(() => {
  resolveFunc();
}, 3000);
await promise;
```

# Sublime Snippet

tools - developer - new snippet


```
<snippet>
    <content><![CDATA[
console.log(${1})
]]></content>
    <!-- Optional: Set a tabTrigger to define how to trigger the snippet -->
    <tabTrigger>log</tabTrigger>
    <!-- Optional: Set a scope to limit where the snippet will trigger -->
    <scope>source.js</scope>
</snippet>
```

сохранить с именем name.sublime-snippet

Список значений `<scope>`

```
ActionScript: source.actionscript.2
AppleScript: source.applescript
ASP: source.asp
Batch FIle: source.dosbatch
C#: source.cs
C++: source.c++
Clojure: source.clojure
CoffeeScript: source.coffee
CSS: source.css
D: source.d
Diff: source.diff
Erlang: source.erlang
Go: source.go
GraphViz: source.dot
Groovy: source.groovy
Haskell: source.haskell
HTML: text.html(.basic)
JSP: text.html.jsp
Java: source.java
Java Properties: source.java-props
Java Doc: text.html.javadoc
JSON: source.json
Javascript: source.js
BibTex: source.bibtex
Latex Log: text.log.latex
Latex Memoir: text.tex.latex.memoir
Latex: text.tex.latex
LESS: source.css.less
TeX: text.tex
Lisp: source.lisp
Lua: source.lua
MakeFile: source.makefile
Markdown: text.html.markdown
Multi Markdown: text.html.markdown.multimarkdown
Matlab: source.matlab
Objective-C: source.objc
Objective-C++: source.objc++
OCaml campl4: source.camlp4.ocaml
OCaml: source.ocaml
OCamllex: source.ocamllex
Perl: source.perl
PHP: source.php
Regular Expression(python): source.regexp.python
Python: source.python
R Console: source.r-console
R: source.r
Ruby on Rails: source.ruby.rails
Ruby HAML: text.haml
SQL(Ruby): source.sql.ruby
Regular Expression: source.regexp
RestructuredText: text.restructuredtext
Ruby: source.ruby
SASS: source.sass
Scala: source.scala
Shell Script: source.shell
SQL: source.sql
Stylus: source.stylus
TCL: source.tcl
HTML(TCL): text.html.tcl
Plain text: text.plain
Textile: text.html.textile
XML: text.xml
XSL: text.xml.xsl
YAML: source.yaml
```
	
# Привязка обработчика события

```
onClickHandler: any;
...

onClick() {
	...
	}


mounted() {
    this.onClickHandler = this.onClick.bind(this);
    document.addEventListener('click', this.onClickOutsideHandler, { passive: true });
  }

beforeDestroy() {
    document.removeEventListener('click', this.onClickOutsideHandler);
  }
```

# Массив уникальных значений
```
return Array.from(new Set(arr));
```