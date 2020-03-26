CREATE procedure [dbo].[payment_posting_upd]
(
   @tt  payment_ids_tt READONLY
  ,@user_id INT
)
AS
BEGIN
   declare @post_id int
   declare @co_code nvarchar(20)
   declare @ttl_amount DECIMAL(18,2)
   SELECT @co_code=company_code FROM dbo.users where user_id=@user_id;
   INSERT INTO dbo.posting_dates (posted_date,company_code,created_by) values (GETDATE(),@co_code,@user_id)
   SELECT @post_id = @@IDENTITY
   UPDATE dbo.payments SET post_id = @post_id  WHERE payment_id IN (SELECT payment_id FROM @tt);
   SELECT @ttl_amount = sum(total_paid_amount) FROM dbo.payments WHERE post_id = @post_id GROUP BY post_id;
   UPDATE dbo.posting_dates SET posted_amount = @ttl_amount WHERE id = @post_id; 
   
END

