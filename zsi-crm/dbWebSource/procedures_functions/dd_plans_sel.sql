CREATE PROCEDURE [dbo].[dd_plans_sel]
( 
     @user_id INT = NULL
)
AS
BEGIN
	SELECT * FROM dbo.plans WHERE is_promo='Y';
 END;



