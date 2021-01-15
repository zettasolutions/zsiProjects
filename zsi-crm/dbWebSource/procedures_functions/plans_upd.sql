
CREATE PROCEDURE [dbo].[plans_upd]
(
    @tt    plans_tt READONLY
   ,@user_id int
)
AS
-- Update Process
	UPDATE a 
		SET 
		   plan_code		= b.plan_code 
		  ,plan_name		= b.plan_name
	      ,plan_srp			= b.plan_srp
		  ,plan_dp			= b.plan_dp
		  ,plan_start_date	= b.plan_start_date
		  ,plan_end_date	= b.plan_end_date
		  ,is_promo			= b.is_promo
		  ,is_active		= b.is_active
          ,updated_by		= @user_id
          ,updated_date		= DATEADD(HOUR, 8, GETUTCDATE())
       FROM dbo.plans a INNER JOIN @tt b
        ON a.plan_id = b.plan_id
		AND (isnull(is_edited,'N')='Y')

-- Insert Process
	INSERT INTO plans (
         plan_code
		,plan_name   
		,plan_srp	
		,plan_dp
		,plan_start_date
		,plan_end_date
		,is_promo
		,is_active	
		,created_by
		,created_date
    )
	SELECT 
		 plan_code   
		,plan_name
		,plan_srp	
		,plan_dp
		,plan_start_date
		,plan_end_date
		,is_promo
		,is_active	
		,@user_id
		,DATEADD(HOUR, 8, GETUTCDATE())
	FROM @tt 
	WHERE plan_id IS NULL
      AND plan_code IS NOT NULL
	  AND plan_name IS NOT NULL;

