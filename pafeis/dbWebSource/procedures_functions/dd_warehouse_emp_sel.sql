CREATE PROCEDURE [dbo].[dd_warehouse_emp_sel]
(
    @warehouse_id	    INT = null
)
AS
BEGIN

SET NOCOUNT ON

  SELECT * FROM users_v WHERE warehouse_id=@warehouse_id ORDER BY first_name, last_name;

END

