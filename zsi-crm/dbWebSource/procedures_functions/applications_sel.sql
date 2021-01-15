

CREATE PROCEDURE [dbo].[applications_sel]
( 
    @user_id INT = NULL
)
AS
BEGIN
	DECLARE @stmt		VARCHAR(4000);
 	SET @stmt = 'SELECT * FROM dbo.applications WHERE 1=1 '; 
 END;

