const moment = require('moment')

module.exports = {
  formatDate: function (date, format) {
    return moment(date).utc().format(format)
  },
  truncate: function (str, len) {
    //console.log(str+ ' ' + len);
    //console.log('Hello')
    if (str.length > len && str.length > 0) {
      let new_str = str + ' '
      // let new_str = str.substr(0,250)
      new_str = str.substr(0, len)
      new_str = str.substr(0, new_str.lastIndexOf(' '))
      new_str = new_str.length > 0 ? new_str : str.substr(0, len)
      //console.log(new_str)
      return new_str + '...'
    }
    return str
  },
  stripTags: function (input, allowed) {                                             
    return input.replace(/<\/?([a-z][a-z0-9]*)\b[^>]*>/gm, '')
  },

  editIcon: function (storyUser, loggedUser, storyId, floating = true){
    if (storyUser._id.toString() == loggedUser._id.toString()) {
      if(floating) {
        return `<a href="/stories/edit/${storyId}" class="btn-floating halfway-fab blue"><i class="fas fa-edit fa-small"></i></a>`
      } else {
        return `<a href = "/stories/edit/${storyId}"><i class = "fas fa-edit"></i></a>`
      }
    } else {
      return ``
    }
  },

  select: function (selected, options) {
    return options
      .fn(this)
      .replace(
        new RegExp(' value="' + selected + '"'),
        '$& selected="selected"'
      )
      .replace(
        new RegExp('>' + selected + '</option>'),
        ' selected="selected"$&'
      )
  },
}


  // function strip_tags (input, allowed) {

  //   allowed = (((allowed || "") + "").toLowerCase().match(/<[a-z][a-z0-9]*>/g) || []).join(''); // making sure the allowed arg is a string containing only tags in lowercase (<a><b><c>)
  //   var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi,