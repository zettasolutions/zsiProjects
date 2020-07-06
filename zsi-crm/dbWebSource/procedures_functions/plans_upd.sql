CREATE PROCEDURE [dbo].[plans_upd]
(
    @tt    plans_tt READONLY
   ,@user_id int
)
AS
-- Update Process
	UPDATE a 
		SET 
		   product_id		= b.product_id 
	      ,plan_srp			= b.plan_srp
		  ,plan_dp			= b.plan_dp
		  ,plan_start_date	= b.plan_start_date
		  ,plan_end_date	= b.plan_end_date
		  ,is_promo			= b.is_promo
		  ,is_active		= b.is_active
          ,updated_by		= @user_id
          ,updated_date		= GETDATE()
       FROM dbo.plans a INNER JOIN @tt b
        ON a.plan_id = b.plan_id
		AND (isnull(is_edited,'N')='Y')

-- Insert Process
	INSERT INTO plans (
         product_id   
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
		 product_id   
		,plan_srp	
		,plan_dp
		,plan_start_date
		,plan_end_date
		,is_promo
		,is_active	
		,@user_id
		,GETDATE()
	FROM @tt 
	WHERE plan_id IS NULL
      AND product_id IS NOT NULL;

