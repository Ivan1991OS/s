describe('Ro‘yxatdan o‘tish testi', () => {
    it('Foydalanuvchi to‘g‘ri ma’lumotlarni kiritib ro‘yxatdan o‘ta olishi kerak', () => {
      cy.visit('http://localhost:3000/register');
  
      cy.get('input[placeholder="Ism"]').type('Test User');
      cy.get('input[placeholder="Email yoki telefon"]').type('testuser@example.com');
      cy.get('input[placeholder="Yangi parol"]').type('Test@12345');
      cy.get('input[type="date"]').type('2000-01-01');
      cy.get('input[type="radio"][value="male"]').check();
      
      cy.get('.register-btn').click();
  
      cy.url().should('include', '/profile');
    });
  });
  