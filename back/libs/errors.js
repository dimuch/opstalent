require('./render');

module.exports =  function *(next) {
  try {
    yield next;
    console.log('status',this.status);
    // if (this.status != 200) {
    //   this.throw(this.status);
    // }
  } catch (e) {
    console.log('e.status 222', e.status);

    if (e.status) {
      // could use template methods to render error page
      switch (e.status){
        case 404:
          console.log(this.req);
          this.render('404');
          break;
        case 409:
          this.body = {
            message: e.message,
            classes: ['alert-warning']
          };
          break;

        case 500:
          this.body = {
            message: e.message,
            classes: e.status == '500' ? ['alert-warning'] : ['alert-success']
          };
          break;
      }
      this.statusCode = e.status;
    }
    if (e.stack) {
      console.error(e.message, e.stack);
    } else {
      this.body = {
        message: 'Server error'
      };
      this.statusCode = 500;
    }
  }
};