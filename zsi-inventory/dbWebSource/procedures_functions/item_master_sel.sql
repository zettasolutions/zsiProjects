




CREATE PROCEDURE [dbo].[item_master_sel]
( 
   @user_id INT = NULL 
)
AS
BEGIN
	DECLARE @stmt		VARCHAR(4000);
 	SET @stmt = 'SELECT * FROM dbo.item_master WHERE 1=1 '; 

	exec(@stmt);
 END;


