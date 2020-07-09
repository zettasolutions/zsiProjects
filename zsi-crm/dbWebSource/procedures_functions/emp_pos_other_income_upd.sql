CREATE PROCEDURE [dbo].[emp_pos_other_income_upd]
(
    @tt    emp_pos_other_income_tt READONLY
   ,@user_id int
)
AS
-- Update Process
	UPDATE a 
		   SET
		      employee_id       = b.employee_id 
	   	     ,position_id		= b.position_id
			 ,other_income_id	= b.other_income_id	   
			 ,amount			= b.amount
			 ,updated_by        = @user_id
			 ,updated_date      = DATEADD(HOUR, 8, GETUTCDATE())
       FROM dbo.emp_pos_other_income a INNER JOIN @tt b
	     ON a.emp_pos_other_income_id = b.emp_pos_other_income_id 
	    AND isnull(b.is_edited,'N')='Y'
		AND isnull(b.amount,0) <> 0
	    AND isnull(b.other_income_id,0) <> 0
	    AND (isnull(b.employee_id,0) <> 0 OR isnull(b.position_id,0) <> 0)


-- Insert Process
	INSERT INTO emp_pos_other_income (
         employee_id
		,position_id 
		,other_income_id	
		,amount	
		,created_by
		,created_date
    )
	SELECT 
		 employee_id
        ,position_id 
		,other_income_id	
		,amount			
		,@user_id
		,DATEADD(HOUR, 8, GETUTCDATE())
	FROM @tt 
	WHERE emp_pos_other_income_id IS NULL
      AND isnull(amount,0) <> 0
	  AND isnull(other_income_id,0) <> 0
	  AND (isnull(employee_id,0) <> 0 OR isnull(position_id,0) <> 0);


