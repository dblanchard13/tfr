describe('services: login', function() {


  var LoginFact, httpBackend;
  
  beforeEach(module('login.services'));
  
  beforeEach(inject(function(_LoginFact_, _$httpBackend_) {
    LoginFact = _LoginFact_;
    httpBackend = _$httpBackend_;
  }));

  // it('should have a get fb info function', function(){
  //   expect(LoginFact.getFbInfo).toBeDefined();
  // });

  var LoginFact;
  
  beforeEach(module('login.services'));
  
  beforeEach(inject(function(_LoginFact_) {
    LoginFact = _LoginFact_;
  }));

  it('should have a get user status function', function(){
    expect(LoginFact.getFbInfo).toBeDefined();
  });
})