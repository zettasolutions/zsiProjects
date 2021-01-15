
CREATE PROCEDURE [dbo].[contracts_plan_inclusions_sel]
(
    @plan_id  INT = null
   ,@user_id INT = NULL
)
AS
BEGIN
	DECLARE @stmt		VARCHAR(4000);
 	SET @stmt = 'SELECT * FROM dbo.plan_inclusions_v WHERE plan_id ='+ cast(@plan_id as varchar(20));

	exec(@stmt);
 END;
