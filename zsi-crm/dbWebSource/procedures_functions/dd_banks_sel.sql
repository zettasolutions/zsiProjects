



CREATE PROCEDURE [dbo].[dd_banks_sel]
( 
    @user_id INT = NULL
)
AS
BEGIN
	SELECT * FROM dbo.banks WHERE is_active='Y';
 END;




