

CREATE PROCEDURE [dbo].[dtr_sel]
(
    @dtr_id  INT = null
   ,@employee_id  varchar(100) = null
   ,@user_id  int = null
)
AS
BEGIN
--  DECLARE @stmt		VARCHAR(4000);
SET NOCOUNT ON

  IF @dtr_id IS NOT NULL  
	 SELECT * FROM dtr_v WHERE dtr_id = @dtr_id; 
  ELSE IF @employee_id IS NOT NULL  
      SELECT * FROM dtr_v WHERE employee_id = @employee_id 
	  ORDER BY employee_id; 
  ELSE IF @user_id IS NOT NULL  
      SELECT * FROM dtr_v WHERE employee_id = @user_id 
	  ORDER BY employee_id; 
  ELSE
      SELECT * FROM dtr_v
	  ORDER BY employee_id; 
	
END
 



