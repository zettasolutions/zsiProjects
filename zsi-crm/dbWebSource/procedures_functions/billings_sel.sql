

CREATE PROCEDURE [dbo].[billings_sel]
( 
	@user_id INT = NULL
)
AS
BEGIN
	SELECT * FROM dbo.billings;
 END;
