CREATE PROCEDURE [dbo].[dd_plans_sel]
( 
     @user_id INT = NULL
	,@plan_id INT = NULL
)
AS
BEGIN
	SELECT plan_id, plan_code, plan_desc FROM dbo.plans;
 END;



