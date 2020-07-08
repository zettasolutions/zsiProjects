CREATE PROCEDURE [dbo].[plans_upd]
(
    @tt    plans_tt READONLY
   ,@user_id int
)
AS
-- Update Process
	UPDATE a 
		SET 
		   plan_code    = b.plan_code 
	      ,plan_desc	= b.plan_desc
		  ,monthly_rate	= b.monthly_rate
		  ,is_active	= b.is_active
          ,updated_by   = @user_id
          ,updated_date = GETDATE()
       FROM dbo.plans a INNER JOIN @tt b
        ON a.plan_id = b.plan_id
		AND (isnull(is_edited,'N')='Y')

-- Insert Process
	INSERT INTO plans (
         plan_code   
		,plan_desc	
		,monthly_rate
		,is_active	
		,created_by
		,created_date
    )
	SELECT 
		 plan_code   
		,plan_desc	
		,monthly_rate
		,is_active	
		,@user_id
		,GETDATE()
	FROM @tt 
	WHERE plan_id IS NULL
      AND plan_code IS NOT NULL;

