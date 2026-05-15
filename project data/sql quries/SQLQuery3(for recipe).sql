select * from recipes
ALTER TABLE Recipes 
ADD Recipe_Image NVARCHAR(MAX) NULL;

DELETE FROM RecipeIngredients WHERE Recipe_Id = 17;
DELETE FROM Recipes WHERE Recipe_Id = 17;

select * from category
select * from RecipeIngredients
select * from Items
-- Biryani (Recipe 18) ki Cat_Id ko 4 (Meat/Chicken) kar dein
UPDATE RecipeIngredients 
SET Cat_Id = 4 
WHERE Recipe_Id = 18;