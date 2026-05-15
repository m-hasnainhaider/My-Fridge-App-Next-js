select * from Users
select * from FridgeUsers

SELECT U.U_Id, U.U_Name, U.Email 
FROM Users U
JOIN Fridge F ON U.U_Id = F.U_Id;


SELECT * FROM FridgeUsers WHERE U_Id = 1;

SELECT * FROM Items WHERE Fridge_Id = 5;

SELECT * FROM Items



DELETE FROM FridgeUsers WHERE U_Id = 1;
INSERT INTO FridgeUsers (U_Id, Fridge_Id) 
VALUES (1, 3);

UPDATE Fridge 
SET U_Id = 1 
WHERE Fridge_Id = 3;

SELECT F.Fridge_Id, F.Fridge_Name, U.U_Name AS OwnerName, U.Email
FROM Fridge F
JOIN Users U ON F.U_Id = U.U_Id
WHERE F.Fridge_Id = 3;

UPDATE Fridge 
SET Fridge_Name = 'Ali Fridge' 
WHERE Fridge_Id = 3;

UPDATE Users 
SET Email = 'ali@gmail.com' 
WHERE U_Id = 1;


DELETE FROM FridgeUsers WHERE Fridge_Id = 7;
DELETE FROM Fridge WHERE Fridge_Id = 7;

IF NOT EXISTS (SELECT 1 FROM FridgeUsers WHERE U_Id = 1 AND Fridge_Id = 3)
BEGIN
    INSERT INTO FridgeUsers (U_Id, Fridge_Id) VALUES (1, 3);
END

UPDATE Fridge SET U_Id = 1 WHERE Fridge_Id = 3;

DELETE FROM FridgeUsers 
WHERE U_Id <> 1;

DELETE FROM Items 
WHERE Fridge_Id <> 3;

DELETE FROM Notifications 
WHERE Item_Id IN (SELECT Item_Id FROM Items WHERE Fridge_Id <> 3);



DELETE FROM RecipeIngredients 
WHERE Recipe_Id IN (SELECT Recipe_Id FROM Recipes WHERE Fridge_Id <> 3);

DELETE FROM Recipes 
WHERE Fridge_Id <> 3;

DELETE FROM Notifications 
WHERE Item_Id IN (SELECT Item_Id FROM Items WHERE Fridge_Id <> 3);

DELETE FROM Fridge 
WHERE U_Id <> 1;


DELETE FROM Favorites WHERE User_Id <> 1;


DELETE FROM Users 
WHERE U_Id <> 1;

UPDATE FridgeUsers SET Fridge_Id = 3 WHERE U_Id = 1;

-- Fridge table mein bhi Owner set karein
UPDATE Fridge SET U_Id = 1 WHERE Fridge_Id = 3;