CREATE PROCEDURE [dbo].[plan_inclusions_upd]
(
    @tt    plan_inclusions_tt READONLY
   ,@user_id int
)
AS
-- Update Process
	UPDATE a 
		SET 
		   plan_id		= b.plan_id 
	      ,app_id		= b.app_id
          ,updated_by   = @user_id
          ,updated_date = GETDATE()
       FROM dbo.plan_inclusions a INNER JOIN @tt b
        ON a.plan_inclusion_id = b.plan_inclusion_id
		AND (isnull(is_edited,'N')='Y')

-- Insert Process
	INSERT INTO plan_inclusions (
         plan_id	
		,app_id	
		,created_by
		,created_date
    )
	SELECT 
		 plan_id	
		,app_id	
		,@user_id
		,GETDATE()
	FROM @tt 
	WHERE plan_inclusion_id IS NULL
      AND plan_id IS NOT NULL
      AND app_id IS NOT NULL;

