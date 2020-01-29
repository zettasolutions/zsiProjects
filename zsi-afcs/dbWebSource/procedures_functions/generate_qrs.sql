create procedure generate_qrs 
as
begin
declare @ctr INT = 0
  while @ctr < 1000
  BEGIN
     INSERT INTO dbo.generated_qrs (hash_key,is_taken, is_active, balance_amt, created_by, created_date) values (newid(), 'N', 'Y',0,3,GETDATE());
	 SET @ctr = @ctr + 1;
  END
end