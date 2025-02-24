describe("Ro'yxatdan o'tish testi", () => {
    it("Foydalanuvchi muvaffaqiyatli ro'yxatdan o'tishi kerak", () => {
      cy.visit("http://localhost:3000/register"); // Saytga kirish
      
      cy.get('input[name="name"]').type("Test User"); // Ism kiritish
      cy.get('input[name="email"]').type("testuser@example.com"); // Email kiritish
      cy.get('input[name="password"]').type("Test123!"); // Parol kiritish
      
      cy.get('button[type="submit"]').click(); // Ro‘yxatdan o‘tish tugmasini bosish
  
      cy.url().should("include", "/profile"); // Foydalanuvchi profile sahifasiga o‘tganini tekshirish
    });
  });
  