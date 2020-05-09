CREATE PROCEDURE [dbo].[plan_inclusions_sel]
(
    @plan_inclusion_id  INT = null
   ,@plan_id  INT = null
   ,@user_id INT = NULL
)
AS
BEGIN
	DECLARE @stmt		VARCHAR(4000);
 	SET @stmt = 'SELECT * FROM dbo.plan_inclusions WHERE 1=1 ';

	IF  ISNULL(@plan_inclusion_id,0) <> 0
	    SET @stmt = @stmt + ' AND plan_inclusion_id ='+ cast(@plan_inclusion_id as varchar(20));
	IF  ISNULL(@plan_id,0) <> 0
	    SET @stmt = @stmt + ' AND plan_id ='+ cast(@plan_id as varchar(20));

	exec(@stmt);
 END;