UPDATE RecipeIngredients SET Cat_Id = 10 WHERE Recipe_Id = 18;
UPDATE RecipeIngredients 
SET Cat_Id = 4 
WHERE Recipe_Id = 18;

UPDATE RecipeIngredients 
SET Cat_Id = 4 
WHERE  Cat_Id = 1;

select * from Favorites







IF OBJECT_ID('Favorites', 'U') IS NOT NULL DROP TABLE Favorites;

CREATE TABLE Favorites (
    FavoriteId INT PRIMARY KEY IDENTITY(1,1),
    User_Id INT NOT NULL,
    Recipe_Id INT NOT NULL,
    -- Foreign Keys jo aapke actual column names se match karein
    CONSTRAINT FK_Favorites_Users FOREIGN KEY (User_Id) REFERENCES Users(U_Id),
    CONSTRAINT FK_Favorites_Recipes FOREIGN KEY (Recipe_Id) REFERENCES Recipes(Recipe_Id) 
);



-- Fridge table mein rating add karein (1 to 4 stars)
ALTER TABLE Fridge ADD Fridge_Rating INT DEFAULT 1;

-- Items table mein Added_Date hona zaroori hai calculation ke liye
-- Agar nahi hai to ye query chalayein:
-- ALTER TABLE Items ADD Added_Date DATETIME DEFAULT GETDATE();

-- Testing ke liye rating update karein
UPDATE Fridge SET Fridge_Rating = 1 WHERE Fridge_Id = 3;
-- Testing ke liye rating update karein
UPDATE Fridge SET FridgeCat_Id = 1 WHERE Fridge_Id = 3 -- Id check karlein jo bhi hai
select * from Fridge

select * from items